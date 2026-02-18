import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { LeaveBalance, LeaveRequest, PageProps } from '@/types';

interface DashboardProps extends PageProps {
    leaveBalances: LeaveBalance[];
    recentRequests: LeaveRequest[];
    pendingApprovalsCount: number;
    stats: {
        total_leaves_taken: number;
        pending_requests: number;
        upcoming_leaves: number;
    };
    teamOnLeave: Array<{
        id: number;
        user_name: string;
        leave_type: string;
        end_date: string;
    }>;
    isManager: boolean;
}

export default function Dashboard({
    auth,
    leaveBalances,
    recentRequests,
    pendingApprovalsCount,
    stats,
    teamOnLeave,
    isManager,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Message */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Welcome back, {auth.user.name}!
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Here's an overview of your leave status.
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Total Days Taken (This Year)
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                {stats.total_leaves_taken}
                            </dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Pending Requests
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600">
                                {stats.pending_requests}
                            </dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Upcoming Leaves
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
                                {stats.upcoming_leaves}
                            </dd>
                        </div>
                        {isManager && (
                            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                                <dt className="truncate text-sm font-medium text-gray-500">
                                    Pending Approvals
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">
                                    {pendingApprovalsCount}
                                </dd>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Leave Balances */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Leave Balances
                                    </h3>
                                    <Link
                                        href={route('leave.create')}
                                        className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
                                    >
                                        Apply Leave
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {leaveBalances.length > 0 ? (
                                    <div className="space-y-4">
                                        {leaveBalances.map((balance) => (
                                            <div key={balance.id} className="rounded-lg border p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="mr-3 h-3 w-3 rounded-full"
                                                            style={{ backgroundColor: balance.color }}
                                                        />
                                                        <span className="font-medium text-gray-900">
                                                            {balance.leave_type}
                                                        </span>
                                                    </div>
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        {balance.remaining} / {balance.allocated}
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                                        <div
                                                            className="h-2 rounded-full"
                                                            style={{
                                                                backgroundColor: balance.color,
                                                                width: `${Math.min((balance.used / balance.allocated) * 100, 100)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                                                        <span>Used: {balance.used}</span>
                                                        <span>Pending: {balance.pending}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No leave balances allocated yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Requests */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Recent Requests
                                    </h3>
                                    <Link
                                        href={route('leave.index')}
                                        className="text-sm font-medium text-orange-600 hover:text-orange-500"
                                    >
                                        View all
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {recentRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentRequests.map((request) => (
                                            <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {request.leave_type}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {request.start_date} - {request.end_date}
                                                    </p>
                                                </div>
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${request.status_color}`}>
                                                    {request.status_label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No recent requests.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Team On Leave (for managers) */}
                    {isManager && teamOnLeave.length > 0 && (
                        <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Team Members On Leave Today
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {teamOnLeave.map((member) => (
                                        <div key={member.id} className="rounded-lg border p-4">
                                            <p className="font-medium text-gray-900">{member.user_name}</p>
                                            <p className="text-sm text-gray-500">{member.leave_type}</p>
                                            <p className="text-xs text-gray-400">Returns: {member.end_date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                Dashboard
            </h2>
        }
    >
        {page}
    </AuthenticatedLayout>
);