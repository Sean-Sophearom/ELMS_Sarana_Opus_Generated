import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEventHandler } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface Employee {
    id: number;
    employee_id?: string;
    name: string;
    email: string;
    role: string;
    department_id?: number;
    manager_id?: number;
    phone?: string;
    hire_date?: string;
    position?: string;
    is_active: boolean;
}

interface Department {
    id: number;
    name: string;
}

interface Manager {
    id: number;
    name: string;
}

interface Role {
    value: string;
    label: string;
}

interface EditEmployeeProps extends PageProps {
    employee: Employee;
    departments: Department[];
    managers: Manager[];
    roles: Role[];
}

export default function Edit({ auth, employee, departments, managers, roles }: EditEmployeeProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: employee.name,
        email: employee.email,
        employee_id: employee.employee_id || '',
        role: employee.role,
        department_id: employee.department_id?.toString() || '',
        manager_id: employee.manager_id?.toString() || '',
        phone: employee.phone || '',
        hire_date: employee.hire_date || '',
        position: employee.position || '',
        is_active: employee.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.employees.update', employee.id));
    };

    return (
        <>
            <Head title="Edit Employee" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="name" value="Full Name" />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Details */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900">Employment Details</h3>
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <InputLabel htmlFor="employee_id" value="Employee ID" />
                                            <TextInput
                                                id="employee_id"
                                                type="text"
                                                value={data.employee_id}
                                                onChange={(e) => setData('employee_id', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.employee_id} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="role" value="Role" />
                                            <select
                                                id="role"
                                                value={data.role}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            >
                                                {roles.map((role) => (
                                                    <option key={role.value} value={role.value}>
                                                        {role.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.role} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="department_id" value="Department" />
                                            <select
                                                id="department_id"
                                                value={data.department_id}
                                                onChange={(e) => setData('department_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.department_id} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="manager_id" value="Manager" />
                                            <select
                                                id="manager_id"
                                                value={data.manager_id}
                                                onChange={(e) => setData('manager_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            >
                                                <option value="">Select Manager</option>
                                                {managers.map((manager) => (
                                                    <option key={manager.id} value={manager.id}>
                                                        {manager.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.manager_id} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="position" value="Position" />
                                            <TextInput
                                                id="position"
                                                type="text"
                                                value={data.position}
                                                onChange={(e) => setData('position', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.position} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="hire_date" value="Hire Date" />
                                            <TextInput
                                                id="hire_date"
                                                type="date"
                                                value={data.hire_date}
                                                onChange={(e) => setData('hire_date', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.hire_date} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="phone" value="Phone" />
                                            <TextInput
                                                id="phone"
                                                type="text"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.phone} className="mt-2" />
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="is_active"
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                            />
                                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                                Active Employee
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3 border-t pt-6">
                                    <Link
                                        href={route('admin.employees.index')}
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

Edit.layout = (page: React.ReactNode) => (
    <AuthenticatedLayout
        header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Employee
                </h2>
                <Link
                    href={route('admin.employees.index')}
                    className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                    Back to Employees
                </Link>
            </div>
        }
    >
        {page}
    </AuthenticatedLayout>
);
