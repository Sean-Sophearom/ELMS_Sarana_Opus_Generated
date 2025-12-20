import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { APP_NAME, APP_TAGLINE } from '@/constants';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center space-x-2">
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center">
                                    {/* <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg> */}
                                    <ApplicationLogo />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    {APP_NAME}
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                                    >
                                        Dashboard
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
                                    <span className="w-2 h-2 bg-orange-600 rounded-full mr-2 animate-pulse"></span>
                                    Simple & Efficient Leave Management
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                    Manage Leave
                                    <span className="block bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                        Effortlessly
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    {APP_TAGLINE}. Track time off, approve requests, and maintain work-life balance 
                                    with our intuitive leave management system.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {!auth.user && (
                                        <>
                                            <Link
                                                href={route('register')}
                                                className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all hover:shadow-lg hover:shadow-orange-200"
                                            >
                                                Register
                                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </Link>
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                                            >
                                                Sign In
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl blur-3xl opacity-20"></div>
                                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                                    {/* Dashboard Preview */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">Leave Balance</h3>
                                            <span className="text-sm text-gray-500">2025</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: 'Annual', used: 5, total: 15, color: 'bg-blue-500' },
                                                { label: 'Sick', used: 2, total: 10, color: 'bg-red-500' },
                                                { label: 'Personal', used: 1, total: 5, color: 'bg-purple-500' },
                                                { label: 'Emergency', used: 0, total: 3, color: 'bg-amber-500' },
                                            ].map((item) => (
                                                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {item.total - item.used}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.used} used of {item.total}
                                                    </div>
                                                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full ${item.color} rounded-full`}
                                                            style={{ width: `${(item.used / item.total) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Recent Request</span>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    Approved
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-medium mt-1">Annual Leave - Dec 23-27</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Everything you need to manage leave
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Our comprehensive leave management system helps you track, approve, and analyze 
                                employee time off with ease.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    ),
                                    title: 'Easy Leave Requests',
                                    description: 'Submit leave requests in seconds with our intuitive calendar interface and automatic day calculation.',
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ),
                                    title: 'Quick Approvals',
                                    description: 'Managers can review and approve requests with one click, keeping the workflow moving smoothly.',
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    ),
                                    title: 'Balance Tracking',
                                    description: 'Real-time leave balance updates ensure employees always know their available time off.',
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    ),
                                    title: 'Team Visibility',
                                    description: 'See who is on leave at a glance to better plan projects and manage team capacity.',
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    ),
                                    title: 'Reports & Analytics',
                                    description: 'Generate detailed reports on leave patterns, trends, and department statistics.',
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    ),
                                    title: 'Role-Based Access',
                                    description: 'Secure access control with distinct permissions for employees, managers, and admins.',
                                },
                            ].map((feature, index) => (
                                <div 
                                    key={index}
                                    className="group p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-12 text-white">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Ready to simplify leave management?
                            </h2>
                            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
                                Join companies that trust {APP_NAME} to manage their employee time off efficiently.
                            </p>
                            {!auth.user && (
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
                                >
                                    Get Started for Free
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-900">{APP_NAME}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
