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
  withNoIncrementalHydration
} from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { CustomPreset } from '../styles';
import { Logger } from './utility/logger/logger';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from 'primeng/api';
import { HttpInterceptorFn } from '@angular/common/http';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { buildMetadata } from '../_build';

// HTTPリクエストのログだし。
export const debugInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[HTTP Request] URL: ${req.url}`);
  return next(req);
};

// JSONデータのロードでタイムスタンプを付与 (キャッシュトラブル回避)
export const cacheBusterInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.match(/data\/.*\.json/)) {
    const modReq = req.clone({ setParams: { v: buildMetadata.timestamp } });
    return next(modReq);
  } else {
    return next(req);
  }
};

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
      }),, withNoIncrementalHydration()
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
    provideHttpClient(withFetch(), withInterceptors([cacheBusterInterceptor, debugInterceptor])),
  ],
};

export const appConfig = commonConfig;
