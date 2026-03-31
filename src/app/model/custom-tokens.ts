import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

// JS標準のwindowオブジェクト
// https://developer.mozilla.org/ja/docs/Web/API/Window
export const WINDOW = new InjectionToken<Window>('Window', {
  factory: () => window,
});

// JS標準のnavigatorオブジェクト
// https://developer.mozilla.org/ja/docs/Web/API/Navigator
export const NAVIGATOR = new InjectionToken<Navigator>('Navigator', {
  factory: () => {
    if (!environment.production && environment.debugLanguage) {
      return {
        language: environment.debugLanguage,
        languages: [environment.debugLanguage],
      } as unknown as Navigator;
    } else {
      return navigator;
    }
  },
});
