import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { APP_NAME } from '@/constants';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useTranslation } from '@/hooks/useTranslation';
import { supportedLocales, localeLabels, type Locale } from '@/locales/config';

export default function Welcome({ auth }: PageProps) {
    const { t, locale } = useTranslation();

    const switchLocale = (next: Locale) => {
        router.post(route('locale.switch', { locale: next }), {}, {
            preserveScroll: true,
        });
    };
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
                                {/* Language toggle */}
                                <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
                                    {supportedLocales.map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => switchLocale(l)}
                                            className={`px-3 py-1.5 transition-colors ${
                                                locale === l
                                                    ? 'bg-orange-600 text-white'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {localeLabels[l]}
                                        </button>
                                    ))}
                                </div>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                                    >
                                        {t('nav.dashboard')}
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <>
                                        <div className="hidden sm:flex items-center space-x-4">
                                            <Link
                                            href={route('login')}
                                            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                                            >
                                                {t('nav.signin')}
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                                            >
                                                {t('nav.get_started')}
                                            </Link>
                                        </div>
                                        <div className='sm:hidden'>
                                            <Link
                                                href={route('login')}
                                                className="items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                                            >
                                                {t('nav.login')}
                                            </Link>
                                        </div>
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
                                    {t('hero.badge')}
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                    {t('hero.h1_line1')}
                                    <span className="text-orange-600 block">
                                        {t('hero.h1_line2')}
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    {t('hero.tagline')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {!auth.user && (
                                        <>
                                            <Link
                                                href={route('register')}
                                                className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all hover:shadow-lg hover:shadow-orange-200"
                                            >
                                                {t('hero.cta_register')}
                                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </Link>
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                                            >
                                                {t('hero.cta_signin')}
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
                                            <h3 className="font-semibold text-gray-900">{t('hero.leave_balance')}</h3>
                                            <span className="text-sm text-gray-500">2025</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: t('hero.leave_types.annual'), used: 5, total: 15, color: 'bg-blue-500' },
                                                { label: t('hero.leave_types.sick'), used: 2, total: 10, color: 'bg-red-500' },
                                                { label: t('hero.leave_types.personal'), used: 1, total: 5, color: 'bg-purple-500' },
                                                { label: t('hero.leave_types.emergency'), used: 0, total: 3, color: 'bg-amber-500' },
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
                                                        {t('hero.used_of').replace('{used}', item.used.toString()).replace('{total}', item.total.toString())}
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
                                                <span className="text-gray-500">{t('hero.recent_request')}</span>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    {t('hero.approved')}
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-medium mt-1">{t('hero.sample_request')}</p>
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
                                {t('features.title')}
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {t('features.subtitle')}
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
                                    title: t('features.items.requests.title'),
                                    description: t('features.items.requests.desc'),
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ),
                                    title: t('features.items.approvals.title'),
                                    description: t('features.items.approvals.desc'),
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    ),
                                    title: t('features.items.balance.title'),
                                    description: t('features.items.balance.desc'),
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    ),
                                    title: t('features.items.visibility.title'),
                                    description: t('features.items.visibility.desc'),
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    ),
                                    title: t('features.items.analytics.title'),
                                    description: t('features.items.analytics.desc'),
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    ),
                                    title: t('features.items.access.title'),
                                    description: t('features.items.access.desc'),
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
                                {t('cta.title')}
                            </h2>
                            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
                                {t('cta.subtitle').replace('{app_name}', APP_NAME)}
                            </p>
                            {!auth.user && (
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
                                >
                                    {t('cta.button')}
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
                            © {new Date().getFullYear()} {APP_NAME}. {t('footer.rights')}
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => page;
