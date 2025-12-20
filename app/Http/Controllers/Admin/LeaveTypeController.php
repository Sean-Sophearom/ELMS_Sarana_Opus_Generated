<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveTypeController extends Controller
{
    /**
     * Display a listing of leave types.
     */
    public function index()
    {
        $leaveTypes = LeaveType::withCount('leaveRequests')
            ->latest()
            ->paginate(10)
            ->through(function ($type) {
                return [
                    'id' => $type->id,
                    'name' => $type->name,
                    'code' => $type->code,
                    'description' => $type->description,
                    'days_per_year' => $type->days_per_year,
                    'is_paid' => $type->is_paid,
                    'requires_approval' => $type->requires_approval,
                    'is_active' => $type->is_active,
                    'color' => $type->color,
                    'leave_requests_count' => $type->leave_requests_count,
                ];
            });

        return Inertia::render('Admin/LeaveTypes/Index', [
            'leaveTypes' => $leaveTypes,
        ]);
    }

    /**
     * Show the form for creating a new leave type.
     */
    public function create()
    {
        return Inertia::render('Admin/LeaveTypes/Create');
    }

    /**
     * Store a newly created leave type.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:leave_types',
            'description' => 'nullable|string|max:500',
            'days_per_year' => 'required|integer|min:0|max:365',
            'is_paid' => 'boolean',
            'requires_approval' => 'boolean',
            'is_active' => 'boolean',
            'color' => 'nullable|string|max:20',
        ]);

        LeaveType::create($validated);

        return redirect()->route('admin.leave-types.index')
            ->with('success', 'Leave type created successfully.');
    }

    /**
     * Show the form for editing a leave type.
     */
    public function edit(LeaveType $leaveType)
    {
        return Inertia::render('Admin/LeaveTypes/Edit', [
            'leaveType' => [
                'id' => $leaveType->id,
                'name' => $leaveType->name,
                'code' => $leaveType->code,
                'description' => $leaveType->description,
                'days_per_year' => $leaveType->days_per_year,
                'is_paid' => $leaveType->is_paid,
                'requires_approval' => $leaveType->requires_approval,
                'is_active' => $leaveType->is_active,
                'color' => $leaveType->color,
            ],
        ]);
    }

    /**
     * Update the specified leave type.
     */
    public function update(Request $request, LeaveType $leaveType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:leave_types,code,' . $leaveType->id,
            'description' => 'nullable|string|max:500',
            'days_per_year' => 'required|integer|min:0|max:365',
            'is_paid' => 'boolean',
            'requires_approval' => 'boolean',
            'is_active' => 'boolean',
            'color' => 'nullable|string|max:20',
        ]);

        $leaveType->update($validated);

        return redirect()->route('admin.leave-types.index')
            ->with('success', 'Leave type updated successfully.');
    }

    /**
     * Remove the specified leave type.
     */
    public function destroy(LeaveType $leaveType)
    {
        if ($leaveType->leaveRequests()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete leave type with existing requests.']);
        }

        $leaveType->delete();

        return redirect()->route('admin.leave-types.index')
            ->with('success', 'Leave type deleted successfully.');
    }
}
