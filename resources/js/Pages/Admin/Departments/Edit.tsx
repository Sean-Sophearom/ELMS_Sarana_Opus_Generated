import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEventHandler } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface EditDepartmentProps extends PageProps {
    department: {
        id: number;
        name: string;
        code: string;
        description?: string;
        is_active: boolean;
    };
}

export default function Edit({ auth, department }: EditDepartmentProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: department.name,
        code: department.code,
        description: department.description || '',
        is_active: department.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.departments.update', department.id));
    };

    return (
        <>
            <Head title="Edit Department" />

            <div className="py-12">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Department Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="code" value="Department Code" />
                                    <TextInput
                                        id="code"
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        className="mt-1 block w-full"
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

                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route('admin.departments.index')}
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
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

Edit.layout = (page: React.ReactNode) => (
    <AuthenticatedLayout
        header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Department
                </h2>
                <Link
                    href={route('admin.departments.index')}
                    className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                    Back to Departments
                </Link>
            </div>
        }
    >
        {page}
    </AuthenticatedLayout>
);
