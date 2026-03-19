import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { UiCatalog } from './ui-catalog';
import { config } from '../../../app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(UiCatalog, config, context);

export default bootstrap;
