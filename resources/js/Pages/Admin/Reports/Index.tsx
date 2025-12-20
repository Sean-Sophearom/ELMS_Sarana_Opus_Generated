import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

interface ReportsProps extends PageProps {
    stats: {
        total_employees: number;
        total_leave_requests: number;
        approved_requests: number;
        pending_requests: number;
        total_days_taken: number;
    };
    leaveByType: Array<{
        name: string;
        color: string;
        total_days: number;
    }>;
    leaveByDepartment: Array<{
        name: string;
        total_days: number;
        employee_count: number;
    }>;
    monthlyTrend: Array<{
        month: string;
        total_days: number;
        request_count: number;
    }>;
    topLeaveTakers: Array<{
        id: number;
        name: string;
        employee_id?: string;
        total_days: number;
    }>;
    year: number;
    years: number[];
}

export default function Index({
    auth,
    stats,
    leaveByType,
    leaveByDepartment,
    monthlyTrend,
    topLeaveTakers,
    year,
    years,
}: ReportsProps) {
    const [selectedYear, setSelectedYear] = useState(year);

    const handleYearChange = (newYear: number) => {
        setSelectedYear(newYear);
        router.get(route('admin.reports.index'), { year: newYear }, {
            preserveState: true,
            replace: true,
        });
    };

    const maxDays = Math.max(...leaveByType.map(t => t.total_days), 1);
    const maxDeptDays = Math.max(...leaveByDepartment.map(d => d.total_days), 1);
    const maxMonthDays = Math.max(...monthlyTrend.map(m => m.total_days), 1);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Reports & Analytics
                    </h2>
                    <select
                        value={selectedYear}
                        onChange={(e) => handleYearChange(parseInt(e.target.value))}
                        className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            }
        >
            <Head title="Reports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Total Employees
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                {stats.total_employees}
                            </dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Total Requests
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                {stats.total_leave_requests}
                            </dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Approved
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
                                {stats.approved_requests}
                            </dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Pending
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600">
                                {stats.pending_requests}
                            </dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">
                                Days Taken
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-orange-600">
                                {stats.total_days_taken}
                            </dd>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Leave by Type */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Leave by Type
                                </h3>
                            </div>
                            <div className="p-6">
                                {leaveByType.length > 0 ? (
                                    <div className="space-y-4">
                                        {leaveByType.map((type, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium text-gray-900">{type.name}</span>
                                                    <span className="text-gray-500">{type.total_days} days</span>
                                                </div>
                                                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className="h-2 rounded-full"
                                                        style={{
                                                            backgroundColor: type.color,
                                                            width: `${(type.total_days / maxDays) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No data available.</p>
                                )}
                            </div>
                        </div>

                        {/* Leave by Department */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Leave by Department
                                </h3>
                            </div>
                            <div className="p-6">
                                {leaveByDepartment.length > 0 ? (
                                    <div className="space-y-4">
                                        {leaveByDepartment.map((dept, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium text-gray-900">
                                                        {dept.name}
                                                        <span className="ml-2 text-xs text-gray-400">
                                                            ({dept.employee_count} employees)
                                                        </span>
                                                    </span>
                                                    <span className="text-gray-500">{dept.total_days} days</span>
                                                </div>
                                                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className="h-2 rounded-full bg-orange-500"
                                                        style={{
                                                            width: `${(dept.total_days / maxDeptDays) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No data available.</p>
                                )}
                            </div>
                        </div>

                        {/* Monthly Trend */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Monthly Leave Trend
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex h-48 items-end space-x-2">
                                    {monthlyTrend.map((month, index) => (
                                        <div key={index} className="flex flex-1 flex-col items-center">
                                            <div
                                                className="w-full rounded-t bg-orange-500"
                                                style={{
                                                    height: `${Math.max((month.total_days / maxMonthDays) * 100, 2)}%`,
                                                }}
                                                title={`${month.total_days} days, ${month.request_count} requests`}
                                            />
                                            <span className="mt-2 text-xs text-gray-500">{month.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Leave Takers */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Top Leave Takers
                                </h3>
                            </div>
                            <div className="p-6">
                                {topLeaveTakers.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {topLeaveTakers.map((employee, index) => (
                                            <li key={employee.id} className="flex items-center justify-between py-3">
                                                <div className="flex items-center">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                                                        {index + 1}
                                                    </span>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {employee.name}
                                                        </p>
                                                        {employee.employee_id && (
                                                            <p className="text-xs text-gray-500">
                                                                {employee.employee_id}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {employee.total_days} days
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No data available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
