import en from './en';
import km from './km';

/**
 * Single source of truth for all locale configuration on the client.
 * Add a new locale here and it automatically propagates to:
 *  - the Locale type used across the app
 *  - the translations map used by useTranslation
 *  - the supportedLocales array used for the language toggle
 */
export const translations = { en, km } as const;

export type Locale = keyof typeof translations;

export const defaultLocale: Locale = 'en';

export const supportedLocales = Object.keys(translations) as Locale[];

/** Human-readable label for each locale, shown in the language switcher. */
export const localeLabels: Record<Locale, string> = {
    en: 'EN',
    km: 'ខ្មែរ',
};

/** Dot-notation string key helper type */
type PathsToLeaves<T, Prefix extends string = ''> = {
    [K in keyof T]: T[K] extends string
        ? `${Prefix}${K & string}`
        : PathsToLeaves<T[K], `${Prefix}${K & string}.`>;
}[keyof T];

export type TranslationPath = PathsToLeaves<typeof en>;

/** Internal traversal helper — not exported; use useTranslation instead. */
export function getNestedValue(obj: Record<string, unknown>, path: string): string {
    return path.split('.').reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object') {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj) as string ?? path;
}
