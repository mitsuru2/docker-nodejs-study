import { Routes } from '@angular/router';
import { Career } from './page/career/career';
import { Diag } from './page/diag/diag';
import { UserReq } from './page/user-req/user-req';
import { SystemDesign } from './page/system-design/system-design';
import { Ci } from './page/ci/ci';
import { FrontEnd } from './page/front-end/front-end';
import { Home } from './page/home/home';

export const routes: Routes = [
  {
    path: 'career',
    component: Career,
  },
  {
    path: 'diag',
    component: Diag,
  },
  {
    path: 'user-req',
    component: UserReq,
  },
  {
    path: 'system-design',
    component: SystemDesign,
  },
  {
    path: 'ci',
    component: Ci,
  },
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
