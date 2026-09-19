import { ButtonSeverity } from 'primeng/button';
import { MessageData } from '../../model/db-data';

export interface CardWithButtonConfigData {
  title?: MessageData;
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
