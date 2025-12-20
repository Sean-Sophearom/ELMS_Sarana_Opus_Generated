import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { LeaveType, Holiday, PageProps } from '@/types';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import DatePicker from '@/Components/DatePicker';
import { FILE_UPLOAD } from '@/constants';

interface LeaveCreateProps extends PageProps {
    leaveTypes: LeaveType[];
    holidays: Holiday[];
}

export default function Create({ auth, leaveTypes, holidays }: LeaveCreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: '',
        is_half_day: false,
        half_day_type: 'morning' as 'morning' | 'afternoon',
        attachment: null as File | null,
    });

    const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);

    const handleLeaveTypeChange = (value: string) => {
        setData('leave_type_id', value);
        const type = leaveTypes.find((t) => t.id === parseInt(value));
        setSelectedLeaveType(type || null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('leave.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const calculateDays = () => {
        if (!data.start_date || !data.end_date) return 0;
        if (data.is_half_day) return 0.5;

        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        let days = 0;

        const holidayDates = holidays.map((h) => h.date);

        while (start <= end) {
            const dayOfWeek = start.getDay();
            const dateStr = start.toISOString().split('T')[0];

            if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.includes(dateStr)) {
                days++;
            }
            start.setDate(start.getDate() + 1);
        }

        return days;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Apply for Leave
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
            <Head title="Apply for Leave" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-6">
                                {/* Leave Type */}
                                <div>
                                    <InputLabel htmlFor="leave_type_id" value="Leave Type" />
                                    <select
                                        id="leave_type_id"
                                        value={data.leave_type_id}
                                        onChange={(e) => handleLeaveTypeChange(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select Leave Type</option>
                                        {leaveTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name} ({type.balance?.remaining ?? type.days_per_year} days remaining)
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.leave_type_id} className="mt-2" />
                                </div>

                                {/* Leave Balance Info */}
                                {selectedLeaveType && selectedLeaveType.balance && (
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <h4 className="font-medium text-gray-900">Leave Balance</h4>
                                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Allocated:</span>
                                                <span className="ml-2 font-medium">{selectedLeaveType.balance.allocated}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Used:</span>
                                                <span className="ml-2 font-medium">{selectedLeaveType.balance.used}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Remaining:</span>
                                                <span className="ml-2 font-medium text-green-600">
                                                    {selectedLeaveType.balance.remaining}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Half Day Option */}
                                <div className="flex items-center">
                                    <input
                                        id="is_half_day"
                                        type="checkbox"
                                        checked={data.is_half_day}
                                        onChange={(e) => setData('is_half_day', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <label htmlFor="is_half_day" className="ml-2 block text-sm text-gray-900">
                                        Half Day Leave
                                    </label>
                                </div>

                                {data.is_half_day && (
                                    <div>
                                        <InputLabel value="Half Day Type" />
                                        <div className="mt-2 flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="morning"
                                                    checked={data.half_day_type === 'morning'}
                                                    onChange={(e) => setData('half_day_type', 'morning')}
                                                    className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Morning</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="afternoon"
                                                    checked={data.half_day_type === 'afternoon'}
                                                    onChange={(e) => setData('half_day_type', 'afternoon')}
                                                    className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Afternoon</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Date Range */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Start Date" />
                                        <DatePicker
                                            id="start_date"
                                            value={data.start_date}
                                            onChange={(date) => setData('start_date', date)}
                                            minDate={new Date().toISOString().split('T')[0]}
                                            holidays={holidays.map(h => h.date)}
                                            disableWeekends={true}
                                            placeholder="Select start date"
                                            error={errors.start_date}
                                        />
                                        <InputError message={errors.start_date} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="end_date" value="End Date" />
                                        <DatePicker
                                            id="end_date"
                                            value={data.end_date}
                                            onChange={(date) => setData('end_date', date)}
                                            minDate={data.start_date || new Date().toISOString().split('T')[0]}
                                            holidays={holidays.map(h => h.date)}
                                            disableWeekends={true}
                                            placeholder="Select end date"
                                            error={errors.end_date}
                                        />
                                        <InputError message={errors.end_date} className="mt-2" />
                                    </div>
                                </div>

                                {/* Calculated Days */}
                                {data.start_date && data.end_date && (
                                    <div className="rounded-lg bg-blue-50 p-4">
                                        <p className="text-sm text-blue-800">
                                            <span className="font-medium">Total Working Days:</span>{' '}
                                            {calculateDays()} day(s)
                                        </p>
                                        <p className="mt-1 text-xs text-blue-600">
                                            Excludes weekends and holidays
                                        </p>
                                    </div>
                                )}

                                {/* Reason */}
                                <div>
                                    <InputLabel htmlFor="reason" value="Reason for Leave" />
                                    <textarea
                                        id="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        placeholder="Please provide the reason for your leave request..."
                                        required
                                    />
                                    <InputError message={errors.reason} className="mt-2" />
                                </div>

                                {/* Attachment */}
                                <div>
                                    <InputLabel htmlFor="attachment" value="Attachment (Optional)" />
                                    <input
                                        id="attachment"
                                        type="file"
                                        onChange={(e) => setData('attachment', e.target.files?.[0] || null)}
                                        accept={FILE_UPLOAD.acceptedExtensions}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Accepted formats: PDF, JPG, PNG, GIF, DOC, DOCX (max {FILE_UPLOAD.maxSizeLabel})
                                    </p>
                                    <InputError message={errors.attachment} className="mt-2" />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route('leave.index')}
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : 'Submit Leave Request'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Upcoming Holidays */}
                    {holidays.length > 0 && (
                        <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Upcoming Holidays
                                </h3>
                            </div>
                            <div className="p-6">
                                <ul className="divide-y divide-gray-200">
                                    {holidays.map((holiday) => (
                                        <li key={holiday.id} className="py-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {holiday.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {holiday.date}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
