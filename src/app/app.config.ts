import {
  ApplicationConfig,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { CustomPreset } from '../styles';
import { Logger } from './utility/logger/logger';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: CustomPreset,
      },
    }),
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      inject(Logger);

      // ブラウザ実行時はユーザーエージェント情報をログに記録。
      if (isPlatformBrowser(platformId)) {
        const ua = window.navigator.userAgent;
        Logger.info(`User Agent: ${ua}`);
      }
    }),
    MessageService,
  ],
};
