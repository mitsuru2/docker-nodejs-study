import { ApplicationConfig } from '@angular/core';
import { appConfig } from '../../app.config';
import { provideRouter } from '@angular/router';

export const uiCatalogAppConfig: ApplicationConfig = {
  ...appConfig,
  providers: [...appConfig.providers, provideRouter([])],
};
