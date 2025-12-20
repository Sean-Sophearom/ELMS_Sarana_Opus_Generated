<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LeaveStatus;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display the reports dashboard.
     */
    public function index(Request $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        // Summary statistics
        $stats = [
            'total_employees' => User::active()->count(),
            'total_leave_requests' => LeaveRequest::whereYear('created_at', $year)->count(),
            'approved_requests' => LeaveRequest::whereYear('created_at', $year)
                ->where('status', LeaveStatus::APPROVED)->count(),
            'pending_requests' => LeaveRequest::where('status', LeaveStatus::PENDING)->count(),
            'total_days_taken' => LeaveRequest::whereYear('start_date', $year)
                ->where('status', LeaveStatus::APPROVED)
                ->sum('total_days'),
        ];

        // Leave by type
        $leaveByType = LeaveType::select('leave_types.name', 'leave_types.color')
            ->selectRaw('COALESCE(SUM(leave_requests.total_days), 0) as total_days')
            ->leftJoin('leave_requests', function ($join) use ($year) {
                $join->on('leave_types.id', '=', 'leave_requests.leave_type_id')
                    ->where('leave_requests.status', LeaveStatus::APPROVED)
                    ->whereYear('leave_requests.start_date', $year);
            })
            ->groupBy('leave_types.id', 'leave_types.name', 'leave_types.color')
            ->get();

        // Leave by department
        $leaveByDepartment = Department::select('departments.name')
            ->selectRaw('COALESCE(SUM(leave_requests.total_days), 0) as total_days')
            ->selectRaw('COUNT(DISTINCT users.id) as employee_count')
            ->leftJoin('users', 'departments.id', '=', 'users.department_id')
            ->leftJoin('leave_requests', function ($join) use ($year) {
                $join->on('users.id', '=', 'leave_requests.user_id')
                    ->where('leave_requests.status', LeaveStatus::APPROVED)
                    ->whereYear('leave_requests.start_date', $year);
            })
            ->groupBy('departments.id', 'departments.name')
            ->get();

        // Monthly trend
        $monthlyTrend = LeaveRequest::selectRaw('MONTH(start_date) as month')
            ->selectRaw('SUM(total_days) as total_days')
            ->selectRaw('COUNT(*) as request_count')
            ->whereYear('start_date', $year)
            ->where('status', LeaveStatus::APPROVED)
            ->groupBy(DB::raw('MONTH(start_date)'))
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $monthlyData = collect(range(1, 12))->map(function ($month) use ($monthlyTrend) {
            $data = $monthlyTrend->get($month);
            return [
                'month' => Carbon::create()->month($month)->format('M'),
                'total_days' => $data?->total_days ?? 0,
                'request_count' => $data?->request_count ?? 0,
            ];
        });

        // Top leave takers
        $topLeaveTakers = User::select('users.id', 'users.name', 'users.employee_id')
            ->selectRaw('SUM(leave_requests.total_days) as total_days')
            ->join('leave_requests', 'users.id', '=', 'leave_requests.user_id')
            ->where('leave_requests.status', LeaveStatus::APPROVED)
            ->whereYear('leave_requests.start_date', $year)
            ->groupBy('users.id', 'users.name', 'users.employee_id')
            ->orderByDesc('total_days')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'stats' => $stats,
            'leaveByType' => $leaveByType,
            'leaveByDepartment' => $leaveByDepartment,
            'monthlyTrend' => $monthlyData,
            'topLeaveTakers' => $topLeaveTakers,
            'year' => $year,
            'years' => range(now()->year - 5, now()->year + 1),
        ]);
    }

    /**
     * Export leave report.
     */
    public function export(Request $request)
    {
        $year = $request->get('year', now()->year);

        $data = LeaveRequest::with(['user.department', 'leaveType'])
            ->whereYear('start_date', $year)
            ->where('status', LeaveStatus::APPROVED)
            ->orderBy('start_date')
            ->get()
            ->map(function ($request) {
                return [
                    'Employee ID' => $request->user->employee_id,
                    'Employee Name' => $request->user->name,
                    'Department' => $request->user->department?->name,
                    'Leave Type' => $request->leaveType->name,
                    'Start Date' => $request->start_date->format('Y-m-d'),
                    'End Date' => $request->end_date->format('Y-m-d'),
                    'Total Days' => $request->total_days,
                    'Status' => $request->status->label(),
                ];
            });

        // Return as JSON for now (can be extended to CSV/Excel)
        return response()->json($data);
    }
}
