import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { LeaveRequest, LeaveType, PageProps, PaginatedData } from '@/types';
import { useState } from 'react';

interface LeaveIndexProps extends PageProps {
    leaveRequests: PaginatedData<LeaveRequest>;
    leaveTypes: LeaveType[];
    filters: {
        status?: string;
        leave_type?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function Index({
    auth,
    leaveRequests,
    leaveTypes,
    filters,
}: LeaveIndexProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('leave.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCancel = (id: number) => {
        if (confirm('Are you sure you want to cancel this leave request?')) {
            router.post(route('leave.cancel', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Leave Requests
                    </h2>
                    <Link
                        href={route('leave.create')}
                        className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
                    >
                        Apply for Leave
                    </Link>
                </div>
            }
        >
            <Head title="My Leave Requests" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        value={localFilters.status || 'all'}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Leave Type
                                    </label>
                                    <select
                                        value={localFilters.leave_type || 'all'}
                                        onChange={(e) => handleFilterChange('leave_type', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    >
                                        <option value="all">All Types</option>
                                        {leaveTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.start_date || ''}
                                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.end_date || ''}
                                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leave Requests Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Leave Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Duration
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Days
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Applied On
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {leaveRequests.data.length > 0 ? (
                                        leaveRequests.data.map((request) => (
                                            <tr key={request.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="mr-3 h-3 w-3 rounded-full"
                                                            style={{ backgroundColor: request.leave_type_color }}
                                                        />
                                                        <span className="font-medium text-gray-900">
                                                            {request.leave_type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {request.start_date} - {request.end_date}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {request.total_days}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${request.status_color}`}>
                                                        {request.status_label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {request.created_at}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('leave.show', request.id)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                    >
                                                        View
                                                    </Link>
                                                    {request.can_cancel && (
                                                        <button
                                                            onClick={() => handleCancel(request.id)}
                                                            className="ml-4 text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                No leave requests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {leaveRequests.meta?.last_page > 1 && (
                            <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {leaveRequests.meta?.from} to {leaveRequests.meta?.to} of{' '}
                                        {leaveRequests.meta?.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {leaveRequests.links.prev && (
                                            <Link
                                                href={leaveRequests.links.prev}
                                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {leaveRequests.links.next && (
                                            <Link
                                                href={leaveRequests.links.next}
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
