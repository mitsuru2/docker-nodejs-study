import { inject, InjectionToken, LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

// JS標準のwindowオブジェクト
// https://developer.mozilla.org/ja/docs/Web/API/Window
export const WINDOW = new InjectionToken<Window | null>('Window', {
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    return isPlatformBrowser(platformId) ? window : null;
  },
});

// JS標準のnavigatorオブジェクト
// https://developer.mozilla.org/ja/docs/Web/API/Navigator
export const NAVIGATOR = new InjectionToken<Navigator>('Navigator', {
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    const locale = inject(LOCALE_ID);

    // Server
    if (!isPlatformBrowser(platformId)) {
      return {
        language: locale,
        languages: [locale],
      } as unknown as Navigator;
    }

    // Client
    if (!environment.production) {
      return {
        ...navigator,
        language: locale,
        languages: [locale],
      } as unknown as Navigator;
    } else {
      return navigator;
    }
  },
});
