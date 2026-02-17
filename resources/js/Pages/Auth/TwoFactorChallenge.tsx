import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef } from 'react';
import { APP_NAME } from '@/constants';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function TwoFactorChallenge({
    status,
    email,
}: {
    status?: string;
    email: string;
}) {
    const codeInput = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    useEffect(() => {
        codeInput.current?.focus();
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.login'));
    };

    const resendCode = () => {
        post(route('two-factor.resend'), {
            preserveScroll: true,
            onSuccess: () => {
                setData('code', '');
                codeInput.current?.focus();
            },
        });
    };

    return (
        <>
            <Head title="Two-Factor Authentication" />
            <div className="min-h-screen flex">
                {/* Left side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-amber-600 p-12 flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 flex items-center justify-center">
                                <ApplicationLogo />
                            </div>
                            <span className="text-xl font-bold text-white">{APP_NAME}</span>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white leading-tight">
                            Secure Your Account
                        </h1>
                        <p className="text-lg text-orange-100">
                            We've sent a verification code to your email address to ensure it's really you.
                        </p>
                    </div>
                    <div className="text-sm text-orange-200">
                        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                    </div>
                </div>

                {/* Right side - 2FA Form */}
                <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-8 text-center">
                            <div className="inline-flex items-center space-x-2">
                                <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                                    {APP_NAME}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                                <p className="text-gray-500 mt-2">
                                    We sent a 6-digit code to
                                </p>
                                <p className="text-gray-900 font-medium mt-1">
                                    {email}
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="code" value="Verification Code" />
                                    <TextInput
                                        id="code"
                                        ref={codeInput}
                                        type="text"
                                        name="code"
                                        value={data.code}
                                        className="mt-1 block w-full text-center text-2xl tracking-widest font-mono"
                                        isFocused={true}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="000000"
                                        maxLength={6}
                                        autoComplete="one-time-code"
                                    />
                                    <InputError message={errors.code} className="mt-2" />
                                </div>

                                <div className="space-y-3">
                                    <PrimaryButton className="w-full justify-center" disabled={processing || data.code.length !== 6}>
                                        {processing ? 'Verifying...' : 'Verify Code'}
                                    </PrimaryButton>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={resendCode}
                                            disabled={processing}
                                            className="text-sm text-orange-600 hover:text-orange-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Didn't receive the code? Resend
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-xs text-gray-500 text-center">
                                    The code will expire in 10 minutes. If you didn't request this code, please ignore this message.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
