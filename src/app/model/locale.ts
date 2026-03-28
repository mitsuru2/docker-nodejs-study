export const appLocales = {
  jp: {
    locale: 'ja-JP',
    country: 'jp',
    lang: 'ja',
  },
  us: {
    locale: 'en-US',
    country: 'us',
    lang: 'en',
  },
} as const;
export type LocaleId = keyof typeof appLocales;
