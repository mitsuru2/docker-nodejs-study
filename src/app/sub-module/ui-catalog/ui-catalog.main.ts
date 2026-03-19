import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '../../app.config';
import { UiCatalog } from './ui-catalog';

bootstrapApplication(UiCatalog, appConfig).catch((err) => console.error(err));
