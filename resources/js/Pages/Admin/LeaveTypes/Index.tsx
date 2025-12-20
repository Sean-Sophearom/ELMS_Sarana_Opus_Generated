import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, PaginatedData } from '@/types';

interface LeaveTypeData {
    id: number;
    name: string;
    code: string;
    description?: string;
    days_per_year: number;
    is_paid: boolean;
    requires_approval: boolean;
    is_active: boolean;
    color: string;
    leave_requests_count: number;
}

interface LeaveTypesIndexProps extends PageProps {
    leaveTypes: PaginatedData<LeaveTypeData>;
}

export default function Index({ auth, leaveTypes }: LeaveTypesIndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this leave type?')) {
            router.delete(route('admin.leave-types.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Leave Types
                    </h2>
                    <Link
                        href={route('admin.leave-types.create')}
                        className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
                    >
                        Add Leave Type
                    </Link>
                </div>
            }
        >
            <Head title="Leave Types" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Leave Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Days/Year
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Paid
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Approval
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
                                    {leaveTypes.data.length > 0 ? (
                                        leaveTypes.data.map((type) => (
                                            <tr key={type.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="mr-3 h-4 w-4 rounded-full"
                                                            style={{ backgroundColor: type.color }}
                                                        />
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {type.name}
                                                            </div>
                                                            {type.description && (
                                                                <div className="text-sm text-gray-500">
                                                                    {type.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {type.code}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {type.days_per_year}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        type.is_paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {type.is_paid ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        type.requires_approval ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {type.requires_approval ? 'Required' : 'Auto'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        type.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {type.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.leave-types.edit', type.id)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(type.id)}
                                                        className="ml-4 text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                No leave types found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
