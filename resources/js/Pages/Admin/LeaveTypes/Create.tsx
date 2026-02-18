import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEventHandler } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { LEAVE_TYPE_COLORS } from '@/constants';

export default function Create({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        days_per_year: 0,
        is_paid: true,
        requires_approval: true,
        is_active: true,
        color: '#3B82F6',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.leave-types.store'));
    };

    return (
        <>
            <Head title="Add Leave Type" />

            <div className="py-12">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Leave Type Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="e.g., Annual Leave"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="code" value="Code" />
                                    <TextInput
                                        id="code"
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        className="mt-1 block w-full"
                                        placeholder="e.g., AL"
                                        required
                                    />
                                    <InputError message={errors.code} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="days_per_year" value="Days Per Year" />
                                    <TextInput
                                        id="days_per_year"
                                        type="number"
                                        min="0"
                                        max="365"
                                        value={data.days_per_year}
                                        onChange={(e) => setData('days_per_year', parseInt(e.target.value) || 0)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.days_per_year} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="Color" />
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {LEAVE_TYPE_COLORS.map((colorOption) => (
                                            <button
                                                key={colorOption.value}
                                                type="button"
                                                onClick={() => setData('color', colorOption.value)}
                                                className={`h-8 w-8 rounded-full border-2 ${
                                                    data.color === colorOption.value ? 'border-gray-900' : 'border-transparent'
                                                }`}
                                                style={{ backgroundColor: colorOption.value }}
                                                title={colorOption.label}
                                            />
                                        ))}
                                    </div>
                                    <InputError message={errors.color} className="mt-2" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            id="is_paid"
                                            type="checkbox"
                                            checked={data.is_paid}
                                            onChange={(e) => setData('is_paid', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label htmlFor="is_paid" className="ml-2 block text-sm text-gray-900">
                                            Paid Leave
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="requires_approval"
                                            type="checkbox"
                                            checked={data.requires_approval}
                                            onChange={(e) => setData('requires_approval', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label htmlFor="requires_approval" className="ml-2 block text-sm text-gray-900">
                                            Requires Approval
                                        </label>
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
                                            Active
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route('admin.leave-types.index')}
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Leave Type'}
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

Create.layout = (page: React.ReactNode) => (
    <AuthenticatedLayout
        header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add Leave Type
                </h2>
                <Link
                    href={route('admin.leave-types.index')}
                    className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                    Back to Leave Types
                </Link>
            </div>
        }
    >
        {page}
    </AuthenticatedLayout>
);
