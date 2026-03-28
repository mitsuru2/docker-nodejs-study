import { bootstrapApplication } from '@angular/platform-browser';
import { UiCatalog } from './ui-catalog';
import { uiCatalogAppConfig } from './ui-catalog.config';

bootstrapApplication(UiCatalog, uiCatalogAppConfig).catch((err) => console.error(err));
