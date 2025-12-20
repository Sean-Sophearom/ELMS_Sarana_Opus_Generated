import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, PaginatedData } from '@/types';
import { useState } from 'react';

interface Employee {
    id: number;
    employee_id?: string;
    name: string;
    email: string;
    role: string;
    role_label: string;
    department?: string;
    manager?: string;
    position?: string;
    hire_date?: string;
    is_active: boolean;
}

interface Department {
    id: number;
    name: string;
}

interface Role {
    value: string;
    label: string;
}

interface EmployeesIndexProps extends PageProps {
    employees: PaginatedData<Employee>;
    departments: Department[];
    roles: Role[];
    filters: {
        search?: string;
        department?: string;
        role?: string;
        status?: string;
    };
}

export default function Index({ auth, employees, departments, roles, filters }: EmployeesIndexProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('admin.employees.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            router.delete(route('admin.employees.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Employees
                    </h2>
                    <Link
                        href={route('admin.employees.create')}
                        className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
                    >
                        Add Employee
                    </Link>
                </div>
            }
        >
            <Head title="Employees" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={localFilters.search || ''}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={localFilters.department || 'all'}
                                        onChange={(e) => handleFilterChange('department', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    >
                                        <option value="all">All Departments</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={localFilters.role || 'all'}
                                        onChange={(e) => handleFilterChange('role', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    >
                                        <option value="all">All Roles</option>
                                        {roles.map((role) => (
                                            <option key={role.value} value={role.value}>
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={localFilters.status || 'all'}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employees Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Manager
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {employees.data.length > 0 ? (
                                        employees.data.map((employee) => (
                                            <tr key={employee.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {employee.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {employee.email}
                                                        </div>
                                                        {employee.employee_id && (
                                                            <div className="text-xs text-gray-400">
                                                                ID: {employee.employee_id}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        employee.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                        employee.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {employee.role_label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {employee.department || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {employee.manager || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {employee.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.employees.edit', employee.id)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(employee.id)}
                                                        className="ml-4 text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                No employees found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {employees.meta?.last_page > 1 && (
                            <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {employees.meta.from} to {employees.meta.to} of{' '}
                                        {employees.meta.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {employees.links.prev && (
                                            <Link
                                                href={employees.links.prev}
                                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {employees.links.next && (
                                            <Link
                                                href={employees.links.next}
                                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
