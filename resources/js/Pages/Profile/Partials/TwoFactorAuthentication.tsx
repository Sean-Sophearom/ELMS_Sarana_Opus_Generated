import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function TwoFactorAuthentication({
    twoFactorEnabled,
    className = '',
}: {
    twoFactorEnabled: boolean;
    className?: string;
}) {
    const [isEnabled, setIsEnabled] = useState(twoFactorEnabled);
    const { post, processing, recentlySuccessful } = useForm({});

    const handleToggle: FormEventHandler = (e) => {
        e.preventDefault();

        // Optimistic update - update UI immediately
        const previousState = isEnabled;
        setIsEnabled(!isEnabled);

        post(route('profile.two-factor.toggle'), {
            preserveScroll: true,
            onError: () => {
                // Rollback on error
                setIsEnabled(previousState);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Two-Factor Authentication
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Add additional security to your account by requiring a verification code sent to your email when you log in.
                </p>
            </header>

            <form onSubmit={handleToggle} className="mt-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isEnabled ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                            {isEnabled ? (
                                <svg className="w-6 h-6 text-green-600 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-gray-400 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">
                                Email Verification Code
                            </div>
                            <div className="text-sm text-gray-500">
                                {isEnabled ? (
                                    <span className="inline-flex items-center transition-all duration-200">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                        Currently enabled
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center transition-all duration-200">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
                                        Currently disabled
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isEnabled ? 'bg-orange-600' : 'bg-gray-300'
                        }`}
                    >
                        <span className="sr-only">Toggle two-factor authentication</span>
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="mt-2 text-sm text-gray-600">
                        Settings saved.
                    </p>
                </Transition>

                {isEnabled && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    How it works
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>When you log in, you'll enter your email and password as usual</li>
                                        <li>We'll send a 6-digit code to your email address</li>
                                        <li>Enter the code to complete your login</li>
                                        <li>Codes expire after 10 minutes for security</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </section>
    );
}
