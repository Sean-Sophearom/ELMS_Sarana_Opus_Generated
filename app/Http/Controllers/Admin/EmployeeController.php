<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index(Request $request)
    {
        $query = User::with('department', 'manager');

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        // Filter by department
        if ($request->has('department') && $request->department !== 'all') {
            $query->where('department_id', $request->department);
        }

        // Filter by role
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $employees = $query->latest()->paginate(10)->through(function ($user) {
            return [
                'id' => $user->id,
                'employee_id' => $user->employee_id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'role_label' => $user->role->label(),
                'department' => $user->department?->name,
                'manager' => $user->manager?->name,
                'position' => $user->position,
                'hire_date' => $user->hire_date?->format('M d, Y'),
                'is_active' => $user->is_active,
            ];
        });

        $departments = Department::active()->get(['id', 'name']);
        $roles = collect(UserRole::cases())->map(fn($role) => [
            'value' => $role->value,
            'label' => $role->label(),
        ]);

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'roles' => $roles,
            'filters' => $request->only(['search', 'department', 'role', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create()
    {
        $departments = Department::active()->get(['id', 'name']);
        $managers = User::where('role', '!=', UserRole::EMPLOYEE)
            ->active()
            ->get(['id', 'name']);
        $roles = collect(UserRole::cases())->map(fn($role) => [
            'value' => $role->value,
            'label' => $role->label(),
        ]);

        return Inertia::render('Admin/Employees/Create', [
            'departments' => $departments,
            'managers' => $managers,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created employee.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'employee_id' => 'nullable|string|max:50|unique:users',
            'role' => 'required|in:admin,manager,employee',
            'department_id' => 'nullable|exists:departments,id',
            'manager_id' => 'nullable|exists:users,id',
            'phone' => 'nullable|string|max:20',
            'hire_date' => 'nullable|date',
            'position' => 'nullable|string|max:100',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee created successfully.');
    }

    /**
     * Show the form for editing an employee.
     */
    public function edit(User $employee)
    {
        $departments = Department::active()->get(['id', 'name']);
        $managers = User::where('role', '!=', UserRole::EMPLOYEE)
            ->where('id', '!=', $employee->id)
            ->active()
            ->get(['id', 'name']);
        $roles = collect(UserRole::cases())->map(fn($role) => [
            'value' => $role->value,
            'label' => $role->label(),
        ]);

        return Inertia::render('Admin/Employees/Edit', [
            'employee' => [
                'id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'name' => $employee->name,
                'email' => $employee->email,
                'role' => $employee->role->value,
                'department_id' => $employee->department_id,
                'manager_id' => $employee->manager_id,
                'phone' => $employee->phone,
                'hire_date' => $employee->hire_date?->format('Y-m-d'),
                'position' => $employee->position,
                'is_active' => $employee->is_active,
            ],
            'departments' => $departments,
            'managers' => $managers,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified employee.
     */
    public function update(Request $request, User $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $employee->id,
            'employee_id' => 'nullable|string|max:50|unique:users,employee_id,' . $employee->id,
            'role' => 'required|in:admin,manager,employee',
            'department_id' => 'nullable|exists:departments,id',
            'manager_id' => 'nullable|exists:users,id',
            'phone' => 'nullable|string|max:20',
            'hire_date' => 'nullable|date',
            'position' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $employee->update($validated);

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    /**
     * Remove the specified employee.
     */
    public function destroy(User $employee)
    {
        $employee->delete();

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}
