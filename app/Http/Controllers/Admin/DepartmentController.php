<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index(Request $request)
    {
        $query = Department::withCount('employees');

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('code', 'like', "%{$request->search}%");
        }

        $departments = $query->latest()->paginate(10)->through(function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code,
                'description' => $department->description,
                'employees_count' => $department->employees_count,
                'is_active' => $department->is_active,
            ];
        });

        return Inertia::render('Admin/Departments/Index', [
            'departments' => $departments,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new department.
     */
    public function create()
    {
        return Inertia::render('Admin/Departments/Create');
    }

    /**
     * Store a newly created department.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:departments',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        Department::create($validated);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department created successfully.');
    }

    /**
     * Show the form for editing a department.
     */
    public function edit(Department $department)
    {
        return Inertia::render('Admin/Departments/Edit', [
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code,
                'description' => $department->description,
                'is_active' => $department->is_active,
            ],
        ]);
    }

    /**
     * Update the specified department.
     */
    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:departments,code,' . $department->id,
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $department->update($validated);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified department.
     */
    public function destroy(Department $department)
    {
        if ($department->employees()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete department with assigned employees.']);
        }

        $department->delete();

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}
