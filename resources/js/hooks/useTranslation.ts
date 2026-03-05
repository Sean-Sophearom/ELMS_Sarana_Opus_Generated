import { usePage } from '@inertiajs/react';
import { translations, defaultLocale, getNestedValue, TranslationPath } from '@/locales/config';
import { PageProps } from '@/types';

/**
 * Translation hook backed by session-stored locale (server-side).
 * No localStorage — locale is resolved via app()->getLocale() on the server
 * and shared through Inertia's shared props, making it SSR-safe.
 */
export function useTranslation() {
    const { locale } = usePage<PageProps>().props;
    const safeLocale = (locale in translations ? locale : defaultLocale);
    const dict = translations[safeLocale] as Record<string, unknown>;

    const t = (key: TranslationPath): string => getNestedValue(dict, key);

    return { t, locale: safeLocale };
}
