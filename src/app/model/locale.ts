export const appLocales = {
  jaJP: {
    id: 'jaJP',
    locale: 'ja', // Angular定義ではja-JPがなくてjaになっている。
    country: 'jp',
    language: 'ja',
    countryName: '日本',
    languageName: '日本語',
  },
  enGB: {
    id: 'enGB',
    locale: 'en-GB',
    country: 'gb',
    language: 'en',
    countryName: 'United Kingdom',
    languageName: 'English',
  },
} as const;
export type LocaleId = keyof typeof appLocales;
export type LocaleData = (typeof appLocales)[LocaleId];
export const appLocaleList: LocaleData[] = Object.values(appLocales);
