import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { APP_NAME } from '@/constants';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create Account" />
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
                            Start managing your leave requests today
                        </h1>
                        <p className="text-lg text-orange-100">
                            Join thousands of employees who use {APP_NAME} to effortlessly track their time off, 
                            submit requests, and maintain work-life balance.
                        </p>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-white">Track all your leave balances in one place</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-white">Quick approval workflow</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-white">Get notified on request updates</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-orange-200">
                        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                    </div>
                </div>

                {/* Right side - Register Form */}
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
                                <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                                <p className="text-gray-500 mt-2">
                                    Already have an account?{' '}
                                    <Link href={route('login')} className="text-orange-600 hover:text-orange-500 font-medium">
                                        Sign in
                                    </Link>
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <InputLabel htmlFor="name" value="Full Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email address" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="you@example.com"
                                        required
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
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Create a strong password"
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                                <div className="pt-2">
                                    <PrimaryButton 
                                        className="w-full justify-center py-3" 
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating account...' : 'Create account'}
                                    </PrimaryButton>
                                </div>

                                <p className="text-xs text-center text-gray-500 mt-4">
                                    By creating an account, you agree to our{' '}
                                    <a href="#" className="text-orange-600 hover:text-orange-500">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-orange-600 hover:text-orange-500">Privacy Policy</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
