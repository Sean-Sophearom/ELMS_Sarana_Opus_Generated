import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { APP_NAME } from '@/constants';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In" />
            <div className="min-h-screen flex">
                {/* Left side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-amber-600 p-12 flex-col justify-between">
                    <div>
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-10 w-10 flex items-center justify-center">
                                <ApplicationLogo />
                            </div>
                            <span className="text-xl font-bold text-white">{APP_NAME}</span>
                        </Link>
                    </div>
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold text-white leading-tight">
                            Welcome back to your leave management dashboard
                        </h1>
                        <p className="text-lg text-orange-100">
                            Track your time off, view balances, and manage leave requests all in one place.
                        </p>
                        <div className="flex items-center space-x-4 pt-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`h-10 w-10 rounded-full border-2 border-orange-500 bg-gradient-to-br ${
                                        i === 1 ? 'from-pink-400 to-pink-600' :
                                        i === 2 ? 'from-blue-400 to-blue-600' :
                                        i === 3 ? 'from-green-400 to-green-600' :
                                        'from-yellow-400 to-yellow-600'
                                    }`}></div>
                                ))}
                            </div>
                            <p className="text-sm text-orange-100">
                                Join NiyAI Data employees managing their leave
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-orange-200">
                        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-8 text-center">
                            <Link href="/" className="inline-flex items-center space-x-2">
                                <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                                    {APP_NAME}
                                </span>
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
                                <p className="text-gray-500 mt-2">
                                    Don't have an account?{' '}
                                    <Link href={route('register')} className="text-orange-600 hover:text-orange-500 font-medium">
                                        Create one
                                    </Link>
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 p-3 rounded-lg bg-green-50 text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <InputLabel htmlFor="email" value="Email address" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData('remember', (e.target.checked || false) as false)
                                            }
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Remember me</span>
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-orange-600 hover:text-orange-500 font-medium"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <PrimaryButton 
                                    className="w-full justify-center py-3" 
                                    disabled={processing}
                                >
                                    {processing ? 'Signing in...' : 'Sign in'}
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = (page: React.ReactNode) => page;
