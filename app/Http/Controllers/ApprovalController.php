<?php

namespace App\Http\Controllers;

use App\Enums\LeaveStatus;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ApprovalController extends Controller
{
    /**
     * Display a listing of pending approvals.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->isAdmin() && !$user->isManager()) {
            abort(403, 'Unauthorized access.');
        }

        $query = LeaveRequest::with(['user.department', 'leaveType'])
            ->when(!$user->isAdmin(), function ($query) use ($user) {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('manager_id', $user->id);
                });
            });

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        } else {
            $query->where('status', LeaveStatus::PENDING);
        }

        $approvals = $query->latest()->paginate(10)->through(function ($request) use ($user) {
            return [
                'id' => $request->id,
                'user' => [
                    'id' => $request->user->id,
                    'name' => $request->user->name,
                    'email' => $request->user->email,
                    'department' => $request->user->department?->name,
                    'position' => $request->user->position,
                ],
                'leave_type' => $request->leaveType->name,
                'leave_type_color' => $request->leaveType->color,
                'start_date' => $request->start_date->format('M d, Y'),
                'end_date' => $request->end_date->format('M d, Y'),
                'total_days' => $request->total_days,
                'status' => $request->status->value,
                'status_label' => $request->status->label(),
                'status_color' => $request->status->bgColor(),
                'reason' => $request->reason,
                'created_at' => $request->created_at->format('M d, Y'),
                'can_approve' => $user->canApprove($request),
            ];
        });

        return Inertia::render('Approvals/Index', [
            'approvals' => $approvals,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Show approval details.
     */
    public function show(LeaveRequest $leaveRequest)
    {
        $user = Auth::user();

        if (!$user->canApprove($leaveRequest)) {
            abort(403, 'Unauthorized access.');
        }

        $leaveRequest->load(['user.department', 'leaveType', 'approver']);

        // Get user's leave history
        $leaveHistory = $leaveRequest->user->leaveRequests()
            ->with('leaveType')
            ->where('status', LeaveStatus::APPROVED)
            ->whereYear('start_date', now()->year)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($request) {
                return [
                    'leave_type' => $request->leaveType->name,
                    'start_date' => $request->start_date->format('M d'),
                    'end_date' => $request->end_date->format('M d'),
                    'total_days' => $request->total_days,
                ];
            });

        // Get leave balance
        $balance = $leaveRequest->user->getLeaveBalance($leaveRequest->leave_type_id);

        return Inertia::render('Approvals/Show', [
            'leaveRequest' => [
                'id' => $leaveRequest->id,
                'user' => [
                    'id' => $leaveRequest->user->id,
                    'name' => $leaveRequest->user->name,
                    'email' => $leaveRequest->user->email,
                    'department' => $leaveRequest->user->department?->name,
                    'position' => $leaveRequest->user->position,
                    'hire_date' => $leaveRequest->user->hire_date?->format('M d, Y'),
                ],
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
                'created_at' => $leaveRequest->created_at->format('M d, Y H:i'),
            ],
            'leaveHistory' => $leaveHistory,
            'balance' => $balance ? [
                'allocated' => $balance->allocated_days,
                'used' => $balance->used_days,
                'pending' => $balance->pending_days,
                'remaining' => $balance->remaining_days,
            ] : null,
        ]);
    }

    /**
     * Approve a leave request.
     */
    public function approve(LeaveRequest $leaveRequest)
    {
        $user = Auth::user();

        if (!$user->canApprove($leaveRequest)) {
            abort(403, 'Unauthorized access.');
        }

        if (!$leaveRequest->isPending()) {
            return back()->withErrors(['error' => 'This leave request is not pending.']);
        }

        DB::transaction(function () use ($leaveRequest, $user) {
            $leaveRequest->update([
                'status' => LeaveStatus::APPROVED,
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);

            // Update balance: move from pending to used
            $balance = $leaveRequest->user->getLeaveBalance($leaveRequest->leave_type_id);
            $balance->decrement('pending_days', $leaveRequest->total_days);
            $balance->increment('used_days', $leaveRequest->total_days);
        });

        return redirect()->route('approvals.index')
            ->with('success', 'Leave request approved successfully.');
    }

    /**
     * Reject a leave request.
     */
    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        $user = Auth::user();

        if (!$user->canApprove($leaveRequest)) {
            abort(403, 'Unauthorized access.');
        }

        if (!$leaveRequest->isPending()) {
            return back()->withErrors(['error' => 'This leave request is not pending.']);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        DB::transaction(function () use ($leaveRequest, $user, $validated) {
            $leaveRequest->update([
                'status' => LeaveStatus::REJECTED,
                'rejection_reason' => $validated['rejection_reason'],
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);

            // Update balance: remove from pending
            $balance = $leaveRequest->user->getLeaveBalance($leaveRequest->leave_type_id);
            $balance->decrement('pending_days', $leaveRequest->total_days);
        });

        return redirect()->route('approvals.index')
            ->with('success', 'Leave request rejected.');
    }
}
