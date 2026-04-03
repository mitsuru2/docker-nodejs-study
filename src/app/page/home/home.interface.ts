import { CardWithButtonConfigData } from '../../ui/card-with-button/card-with-button.interface';

export const SkillMenuItem = {
  userReq: 'user-req',
  systemDesign: 'system-design',
  frontEnd: 'front-end',
  ci: 'ci',
  diag: 'diag',
} as const;
export type SkillMenuItemIdType = (typeof SkillMenuItem)[keyof typeof SkillMenuItem];
