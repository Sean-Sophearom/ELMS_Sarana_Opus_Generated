import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEventHandler, useState } from 'react';

interface ApprovalShowProps extends PageProps {
    leaveRequest: {
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
            department?: string;
            position?: string;
            hire_date?: string;
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
        rejection_reason?: string;
        is_half_day: boolean;
        half_day_type?: string;
        created_at: string;
    };
    leaveHistory: Array<{
        leave_type: string;
        start_date: string;
        end_date: string;
        total_days: number;
    }>;
    balance: {
        allocated: number;
        used: number;
        pending: number;
        remaining: number;
    } | null;
}

export default function Show({ auth, leaveRequest, leaveHistory, balance }: ApprovalShowProps) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        rejection_reason: '',
    });

    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this leave request?')) {
            router.post(route('approvals.approve', leaveRequest.id));
        }
    };

    const handleReject: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('approvals.reject', leaveRequest.id), {
            onSuccess: () => setShowRejectModal(false),
        });
    };

    return (
        <>
            <Head title="Review Leave Request" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Request Details */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div
                                                className="mr-3 h-4 w-4 rounded-full"
                                                style={{ backgroundColor: leaveRequest.leave_type_color }}
                                            />
                                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                                {leaveRequest.leave_type}
                                            </h3>
                                        </div>
                                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${leaveRequest.status_color}`}>
                                            {leaveRequest.status_label}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Duration</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {leaveRequest.start_date} - {leaveRequest.end_date}
                                                {leaveRequest.is_half_day && (
                                                    <span className="ml-2 text-gray-500">
                                                        ({leaveRequest.half_day_type} half)
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Total Days</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {leaveRequest.total_days} day(s)
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Reason</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {leaveRequest.reason}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Applied On</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {leaveRequest.created_at}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Action Buttons */}
                                {leaveRequest.status === 'pending' && (
                                    <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleApprove}
                                                className="inline-flex justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setShowRejectModal(true)}
                                                className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Leave History */}
                            {leaveHistory.length > 0 && (
                                <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            Recent Leave History
                                        </h3>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <ul className="divide-y divide-gray-200">
                                            {leaveHistory.map((leave, index) => (
                                                <li key={index} className="px-4 py-4 sm:px-6">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {leave.leave_type}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {leave.start_date} - {leave.end_date}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {leave.total_days} day(s)
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Employee Info */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Employee Details
                                    </h3>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {leaveRequest.user.name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {leaveRequest.user.email}
                                            </dd>
                                        </div>
                                        {leaveRequest.user.department && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Department</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {leaveRequest.user.department}
                                                </dd>
                                            </div>
                                        )}
                                        {leaveRequest.user.position && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Position</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {leaveRequest.user.position}
                                                </dd>
                                            </div>
                                        )}
                                        {leaveRequest.user.hire_date && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {leaveRequest.user.hire_date}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {/* Leave Balance */}
                            {balance && (
                                <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                            Leave Balance
                                        </h3>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                        <dl className="space-y-4">
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-500">Allocated</dt>
                                                <dd className="text-sm font-medium text-gray-900">
                                                    {balance.allocated}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-500">Used</dt>
                                                <dd className="text-sm font-medium text-gray-900">
                                                    {balance.used}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-500">Pending</dt>
                                                <dd className="text-sm font-medium text-yellow-600">
                                                    {balance.pending}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between border-t pt-4">
                                                <dt className="text-sm font-medium text-gray-900">Remaining</dt>
                                                <dd className="text-sm font-medium text-green-600">
                                                    {balance.remaining}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowRejectModal(false)}
                        />
                        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <form onSubmit={handleReject}>
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Reject Leave Request
                                    </h3>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Rejection Reason
                                        </label>
                                        <textarea
                                            value={data.rejection_reason}
                                            onChange={(e) => setData('rejection_reason', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            placeholder="Please provide a reason for rejection..."
                                            required
                                        />
                                        {errors.rejection_reason && (
                                            <p className="mt-2 text-sm text-red-600">{errors.rejection_reason}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRejectModal(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Show.layout = (page: React.ReactNode) => (
    <AuthenticatedLayout
        header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Review Leave Request
                </h2>
                <Link
                    href={route('approvals.index')}
                    className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                    Back to Approvals
                </Link>
            </div>
        }
    >
        {page}
    </AuthenticatedLayout>
);
