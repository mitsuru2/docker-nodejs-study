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
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { CustomPreset } from '../styles';
import { Logger } from './utility/logger/logger';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const commonConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        includePostRequests: false,
        includeHeaders: [],
      }),
    ),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: CustomPreset,
      },
    }),
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      const logger = inject(Logger);

      // ブラウザ実行時はユーザーエージェント情報をログに記録。
      if (isPlatformBrowser(platformId)) {
        const ua = window.navigator.userAgent;
        logger.info(`User Agent: ${ua}`);
      }
    }),
    MessageService,
    provideHttpClient(withFetch()),
  ],
};

export const appConfig = commonConfig;
