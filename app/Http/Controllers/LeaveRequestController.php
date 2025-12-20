<?php

namespace App\Http\Controllers;

use App\Enums\LeaveStatus;
use App\Models\Holiday;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of leave requests.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = $user->leaveRequests()->with('leaveType');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by leave type
        if ($request->has('leave_type') && $request->leave_type !== 'all') {
            $query->where('leave_type_id', $request->leave_type);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('start_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->whereDate('end_date', '<=', $request->end_date);
        }

        $leaveRequests = $query->latest()->paginate(10)->through(function ($request) {
            return [
                'id' => $request->id,
                'leave_type' => $request->leaveType->name,
                'leave_type_color' => $request->leaveType->color,
                'start_date' => $request->start_date->format('M d, Y'),
                'end_date' => $request->end_date->format('M d, Y'),
                'total_days' => $request->total_days,
                'status' => $request->status->value,
                'status_label' => $request->status->label(),
                'status_color' => $request->status->bgColor(),
                'reason' => $request->reason,
                'rejection_reason' => $request->rejection_reason,
                'created_at' => $request->created_at->format('M d, Y'),
                'can_cancel' => $request->canBeCancelled(),
            ];
        });

        $leaveTypes = LeaveType::active()->get(['id', 'name']);

        return Inertia::render('Leave/Index', [
            'leaveRequests' => $leaveRequests,
            'leaveTypes' => $leaveTypes,
            'filters' => $request->only(['status', 'leave_type', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Show the form for creating a new leave request.
     */
    public function create()
    {
        $user = Auth::user();
        $currentYear = now()->year;

        $leaveTypes = LeaveType::active()->get()->map(function ($type) use ($user, $currentYear) {
            $balance = $user->getLeaveBalance($type->id, $currentYear);
            return [
                'id' => $type->id,
                'name' => $type->name,
                'color' => $type->color,
                'days_per_year' => $type->days_per_year,
                'requires_approval' => $type->requires_approval,
                'balance' => $balance ? [
                    'allocated' => $balance->allocated_days,
                    'used' => $balance->used_days,
                    'remaining' => $balance->remaining_days,
                ] : [
                    'allocated' => $type->days_per_year,
                    'used' => 0,
                    'remaining' => $type->days_per_year,
                ],
            ];
        });

        // Get holidays for the calendar
        $holidays = Holiday::forYear($currentYear)->get(['id', 'name', 'date']);

        return Inertia::render('Leave/Create', [
            'leaveTypes' => $leaveTypes,
            'holidays' => $holidays,
        ]);
    }

    /**
     * Store a newly created leave request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:1000',
            'is_half_day' => 'boolean',
            'half_day_type' => 'required_if:is_half_day,true|in:morning,afternoon',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png,gif,doc,docx|max:5120',
        ]);

        $user = Auth::user();
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);

        // Calculate total days (excluding weekends and holidays)
        $totalDays = $this->calculateBusinessDays($startDate, $endDate);

        if ($validated['is_half_day'] ?? false) {
            $totalDays = 0.5;
        }

        // Check leave balance
        $balance = $user->getLeaveBalance($validated['leave_type_id']);
        if (!$balance || $balance->remaining_days < $totalDays) {
            return back()->withErrors(['leave_type_id' => 'Insufficient leave balance.']);
        }

        // Check for overlapping requests
        $overlap = $user->leaveRequests()
            ->whereIn('status', [LeaveStatus::PENDING, LeaveStatus::APPROVED])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->exists();

        if ($overlap) {
            return back()->withErrors(['start_date' => 'You already have a leave request for this period.']);
        }

        DB::transaction(function () use ($validated, $user, $totalDays, $request) {
            // Handle file upload
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $attachmentPath = $request->file('attachment')->store('attachments', 'public');
            }

            // Create leave request
            LeaveRequest::create([
                'user_id' => $user->id,
                'leave_type_id' => $validated['leave_type_id'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_days' => $totalDays,
                'reason' => $validated['reason'],
                'is_half_day' => $validated['is_half_day'] ?? false,
                'half_day_type' => $validated['half_day_type'] ?? null,
                'attachment' => $attachmentPath,
            ]);

            // Update pending days in balance
            $balance = $user->getLeaveBalance($validated['leave_type_id']);
            $balance->increment('pending_days', $totalDays);
        });

        return redirect()->route('leave.index')
            ->with('success', 'Leave request submitted successfully.');
    }

    /**
     * Display the specified leave request.
     */
    public function show(LeaveRequest $leaveRequest)
    {
        // $this->authorize('view', $leaveRequest);

        $leaveRequest->load(['leaveType', 'user', 'approver']);

        return Inertia::render('Leave/Show', [
            'leaveRequest' => [
                'id' => $leaveRequest->id,
                'leave_type' => $leaveRequest->leaveType->name,
                'leave_type_color' => $leaveRequest->leaveType->color,
                'start_date' => $leaveRequest->start_date->format('M d, Y'),
                'end_date' => $leaveRequest->end_date->format('M d, Y'),
                'total_days' => $leaveRequest->total_days,
                'status' => $leaveRequest->status->value,
                'status_label' => $leaveRequest->status->label(),
                'status_color' => $leaveRequest->status->bgColor(),
                'reason' => $leaveRequest->reason,
                'rejection_reason' => $leaveRequest->rejection_reason,
                'is_half_day' => $leaveRequest->is_half_day,
                'half_day_type' => $leaveRequest->half_day_type,
                'attachment' => $leaveRequest->attachment ? Storage::url($leaveRequest->attachment) : null,
                'created_at' => $leaveRequest->created_at->format('M d, Y H:i'),
                'approved_at' => $leaveRequest->approved_at?->format('M d, Y H:i'),
                'approver' => $leaveRequest->approver?->name,
                'can_cancel' => $leaveRequest->canBeCancelled(),
            ],
        ]);
    }

    /**
     * Cancel a leave request.
     */
    public function cancel(LeaveRequest $leaveRequest)
    {
        $this->authorize('cancel', $leaveRequest);

        if (!$leaveRequest->canBeCancelled()) {
            return back()->withErrors(['error' => 'This leave request cannot be cancelled.']);
        }

        DB::transaction(function () use ($leaveRequest) {
            $previousStatus = $leaveRequest->status;

            $leaveRequest->update(['status' => LeaveStatus::CANCELLED]);

            // Update balance
            $balance = $leaveRequest->user->getLeaveBalance($leaveRequest->leave_type_id);
            
            if ($previousStatus === LeaveStatus::PENDING) {
                $balance->decrement('pending_days', $leaveRequest->total_days);
            } elseif ($previousStatus === LeaveStatus::APPROVED) {
                $balance->decrement('used_days', $leaveRequest->total_days);
            }
        });

        return back()->with('success', 'Leave request cancelled successfully.');
    }

    /**
     * Calculate business days between two dates.
     */
    private function calculateBusinessDays(Carbon $startDate, Carbon $endDate): float
    {
        $days = 0;
        $current = $startDate->copy();
        $holidays = Holiday::whereBetween('date', [$startDate, $endDate])
            ->pluck('date')
            ->map(fn($date) => $date->format('Y-m-d'))
            ->toArray();

        while ($current <= $endDate) {
            // Skip weekends and holidays
            if (!$current->isWeekend() && !in_array($current->format('Y-m-d'), $holidays)) {
                $days++;
            }
            $current->addDay();
        }

        return $days;
    }
}
