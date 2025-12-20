<?php

namespace App\Http\Controllers;

use App\Enums\LeaveStatus;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $currentYear = now()->year;

        // Get leave balances for current user
        $leaveBalances = $user->leaveBalances()
            ->with('leaveType')
            ->where('year', $currentYear)
            ->get()
            ->map(function ($balance) {
                return [
                    'id' => $balance->id,
                    'leave_type' => $balance->leaveType->name,
                    'color' => $balance->leaveType->color,
                    'allocated' => $balance->allocated_days,
                    'used' => $balance->used_days,
                    'pending' => $balance->pending_days,
                    'remaining' => $balance->remaining_days,
                ];
            });

        // Get recent leave requests
        $recentRequests = $user->leaveRequests()
            ->with('leaveType')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'leave_type' => $request->leaveType->name,
                    'start_date' => $request->start_date->format('M d, Y'),
                    'end_date' => $request->end_date->format('M d, Y'),
                    'total_days' => $request->total_days,
                    'status' => $request->status->value,
                    'status_label' => $request->status->label(),
                    'status_color' => $request->status->bgColor(),
                ];
            });

        // Get pending approvals count for managers/admins
        $pendingApprovalsCount = 0;
        if ($user->isAdmin() || $user->isManager()) {
            $pendingApprovalsCount = $this->getPendingApprovalsQuery($user)->count();
        }

        // Get statistics
        $stats = [
            'total_leaves_taken' => $user->leaveRequests()
                ->where('status', LeaveStatus::APPROVED)
                ->whereYear('start_date', $currentYear)
                ->sum('total_days'),
            'pending_requests' => $user->leaveRequests()
                ->where('status', LeaveStatus::PENDING)
                ->count(),
            'upcoming_leaves' => $user->leaveRequests()
                ->where('status', LeaveStatus::APPROVED)
                ->where('start_date', '>', now())
                ->count(),
        ];

        // Get team on leave today (for managers/admins)
        $teamOnLeave = [];
        if ($user->isAdmin() || $user->isManager()) {
            $teamOnLeave = LeaveRequest::with('user', 'leaveType')
                ->where('status', LeaveStatus::APPROVED)
                ->whereDate('start_date', '<=', now())
                ->whereDate('end_date', '>=', now())
                ->when($user->isManager(), function ($query) use ($user) {
                    $query->whereHas('user', function ($q) use ($user) {
                        $q->where('manager_id', $user->id);
                    });
                })
                ->get()
                ->map(function ($request) {
                    return [
                        'id' => $request->id,
                        'user_name' => $request->user->name,
                        'leave_type' => $request->leaveType->name,
                        'end_date' => $request->end_date->format('M d, Y'),
                    ];
                });
        }

        return Inertia::render('Dashboard', [
            'leaveBalances' => $leaveBalances,
            'recentRequests' => $recentRequests,
            'pendingApprovalsCount' => $pendingApprovalsCount,
            'stats' => $stats,
            'teamOnLeave' => $teamOnLeave,
            'isManager' => $user->isManager() || $user->isAdmin(),
        ]);
    }

    private function getPendingApprovalsQuery($user)
    {
        return LeaveRequest::where('status', LeaveStatus::PENDING)
            ->when($user->isManager() && !$user->isAdmin(), function ($query) use ($user) {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('manager_id', $user->id);
                });
            });
    }
}
