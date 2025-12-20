import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, PaginatedData } from '@/types';
import { useState } from 'react';

interface ApprovalRequest {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        department?: string;
        position?: string;
    };
    leave_type: string;
    leave_type_color: string;
    start_date: string;
    end_date: string;
    total_days: number;
    status: string;
    status_label: string;
    status_color: string;
    reason: string;
    created_at: string;
    can_approve: boolean;
}

interface ApprovalsIndexProps extends PageProps {
    approvals: PaginatedData<ApprovalRequest>;
    filters: {
        status?: string;
    };
}

export default function Index({ auth, approvals, filters }: ApprovalsIndexProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('approvals.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleQuickApprove = (id: number) => {
        if (confirm('Are you sure you want to approve this leave request?')) {
            router.post(route('approvals.approve', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Leave Approvals
                </h2>
            }
        >
            <Head title="Leave Approvals" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium text-gray-700">
                                    Status:
                                </label>
                                <select
                                    value={localFilters.status || 'pending'}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="all">All</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Approvals Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Employee
                                        </th>
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
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {approvals.data.length > 0 ? (
                                        approvals.data.map((approval) => (
                                            <tr key={approval.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {approval.user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {approval.user.department} • {approval.user.position}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="mr-3 h-3 w-3 rounded-full"
                                                            style={{ backgroundColor: approval.leave_type_color }}
                                                        />
                                                        <span className="font-medium text-gray-900">
                                                            {approval.leave_type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {approval.start_date} - {approval.end_date}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {approval.total_days}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${approval.status_color}`}>
                                                        {approval.status_label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('approvals.show', approval.id)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                    >
                                                        Review
                                                    </Link>
                                                    {approval.can_approve && approval.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleQuickApprove(approval.id)}
                                                            className="ml-4 text-green-600 hover:text-green-900"
                                                        >
                                                            Quick Approve
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
                        {approvals.meta?.last_page > 1 && (
                            <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {approvals.meta.from} to {approvals.meta.to} of{' '}
                                        {approvals.meta.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {approvals.links.prev && (
                                            <Link
                                                href={approvals.links.prev}
                                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {approvals.links.next && (
                                            <Link
                                                href={approvals.links.next}
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
