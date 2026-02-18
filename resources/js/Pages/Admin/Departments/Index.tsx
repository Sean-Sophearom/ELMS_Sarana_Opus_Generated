import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, PaginatedData } from '@/types';
import { useState } from 'react';

interface Department {
    id: number;
    name: string;
    code: string;
    description?: string;
    employees_count: number;
    is_active: boolean;
}

interface DepartmentsIndexProps extends PageProps {
    departments: PaginatedData<Department>;
    filters: {
        search?: string;
    };
}

export default function Index({ auth, departments, filters }: DepartmentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('admin.departments.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(route('admin.departments.destroy', id));
        }
    };

    return (
        <>
            <Head title="Departments" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        />
                    </div>

                    {/* Departments Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Employees
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
                                    {departments.data.length > 0 ? (
                                        departments.data.map((department) => (
                                            <tr key={department.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {department.name}
                                                        </div>
                                                        {department.description && (
                                                            <div className="text-sm text-gray-500">
                                                                {department.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {department.code}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {department.employees_count}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        department.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {department.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.departments.edit', department.id)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(department.id)}
                                                        className="ml-4 text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                No departments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <AuthenticatedLayout
        header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Departments
                </h2>
                <Link
                    href={route('admin.departments.create')}
                    className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
                >
                    Add Department
                </Link>
            </div>
        }
    >
        {page}
    </AuthenticatedLayout>
);
