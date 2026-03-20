import { ButtonSeverity } from 'primeng/button';

export interface ButtonConfigData {
  id: string;
  label?: string;
  icon?: string;
  round?: boolean;
  outline?: boolean;
  width?: string;
  severity?: ButtonSeverity;
}

export interface ButtonOutputData {
  id: string;
}
