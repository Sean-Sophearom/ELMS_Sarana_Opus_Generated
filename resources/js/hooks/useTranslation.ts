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

    type TranslationParams = Record<string, string | number>;

    const t = (
        key: TranslationPath,
        ...params: (string | number | TranslationParams)[]
    ): string => {
        // 1. Fetch the raw translation string
        let value = getNestedValue(dict, key);

        // Safety check in case the key doesn't exist or isn't a string
        if (typeof value !== 'string') return value || key;

        if (params.length === 0) return value;

        // 2. Check if the user passed a keyed object: t('key', { used: 1, total: 2 })
        if (
            params.length === 1 &&
            typeof params[0] === 'object' &&
            params[0] !== null &&
            !Array.isArray(params[0])
        ) {
            const keyedParams = params[0] as TranslationParams;

            for (const [k, v] of Object.entries(keyedParams)) {
                // Use regex with 'g' to replace ALL occurrences of the key
                value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
            }
        }
        // 3. Otherwise, handle as positional parameters strictly left-to-right
        else {
            params.forEach((v) => {
                if (typeof v === 'string' || typeof v === 'number') {
                    // Replaces the first available {anything} with the current parameter
                    value = value.replace(/\{[^}]*\}/, String(v));
                }
            });
        }

        return value;
    };

    return { t, locale: safeLocale };
}
