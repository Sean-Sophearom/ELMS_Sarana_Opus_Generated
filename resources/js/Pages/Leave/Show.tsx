import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

interface LeaveShowProps extends PageProps {
    leaveRequest: {
        id: number;
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
        attachment?: string;
        attachment_name?: string;
        created_at: string;
        approved_at?: string;
        approver?: string;
        can_cancel: boolean;
    };
}

const getFileIcon = (filename?: string) => {
    if (!filename) return null;
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (ext === 'pdf') {
        return (
            <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                <path d="M8 11a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            </svg>
        );
    }
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
        return (
            <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
        );
    }
    
    return (
        <svg className="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
    );
};

const isImageFile = (filename?: string) => {
    if (!filename) return false;
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
};

export default function Show({ auth, leaveRequest }: LeaveShowProps) {
    const [showPreview, setShowPreview] = useState(false);
    
    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this leave request?')) {
            router.post(route('leave.cancel', leaveRequest.id));
        }
    };

    const attachmentFilename = leaveRequest.attachment?.split('/').pop() || leaveRequest.attachment_name;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Leave Request Details
                    </h2>
                    <Link
                        href={route('leave.index')}
                        className="text-sm font-medium text-orange-600 hover:text-orange-500"
                    >
                        Back to My Requests
                    </Link>
                </div>
            }
        >
            <Head title="Leave Request Details" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
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
                                {leaveRequest.rejection_reason && (
                                    <div className="bg-red-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-red-700">Rejection Reason</dt>
                                        <dd className="mt-1 text-sm text-red-900 sm:col-span-2 sm:mt-0">
                                            {leaveRequest.rejection_reason}
                                        </dd>
                                    </div>
                                )}
                                {leaveRequest.attachment && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Attachment</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                <div className="flex items-center space-x-4">
                                                    {getFileIcon(attachmentFilename)}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="truncate text-sm font-medium text-gray-900">
                                                            {attachmentFilename || 'Attachment'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {isImageFile(attachmentFilename) ? 'Image file' : 'Document'}
                                                        </p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        {isImageFile(attachmentFilename) && (
                                                            <button
                                                                onClick={() => setShowPreview(!showPreview)}
                                                                className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                                            >
                                                                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                {showPreview ? 'Hide' : 'Preview'}
                                                            </button>
                                                        )}
                                                        <a
                                                            href={leaveRequest.attachment}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center rounded-md bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
                                                        >
                                                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                            Download
                                                        </a>
                                                    </div>
                                                </div>
                                                
                                                {/* Image Preview */}
                                                {showPreview && isImageFile(attachmentFilename) && (
                                                    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                                                        <img
                                                            src={leaveRequest.attachment}
                                                            alt="Attachment preview"
                                                            className="max-h-96 w-full object-contain bg-gray-50"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </dd>
                                    </div>
                                )}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Applied On</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {leaveRequest.created_at}
                                    </dd>
                                </div>
                                {leaveRequest.approved_at && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            {leaveRequest.status === 'approved' ? 'Approved' : 'Processed'} By
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {leaveRequest.approver} on {leaveRequest.approved_at}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {leaveRequest.can_cancel && (
                            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                                <button
                                    onClick={handleCancel}
                                    className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                                >
                                    Cancel Request
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
