import { ButtonSeverity } from 'primeng/button';

export interface CardWithButtonConfigData {
  title?: string;
  button: {
    id: string;
    label?: string;
    icon?: string;
    severity?: ButtonSeverity;
  };
}

export interface CardWithButtonOutputData {
  id: string; // ボタンのID。
}
