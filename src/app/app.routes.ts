import { Routes } from '@angular/router';
import { FrontEnd } from './page/front-end/front-end';
import { Home } from './page/home/home';

export const routes: Routes = [
  {
    path: 'front-end',
    component: FrontEnd,
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: '',
    component: Home,
  },
];
