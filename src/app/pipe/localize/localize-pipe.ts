import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { MessageData } from '../../model/db-data';
import { appLocales } from '../../model/locale';

@Pipe({
  name: 'localize',
})
export class LocalizePipe implements PipeTransform {
  // 現在ロケール
  private locale = inject(LOCALE_ID);

  transform(value: MessageData | null | undefined): string {
    if (!value) {
      return '';
    }

    // 日本語じゃないかつ英語定義があれば英語
    if (this.locale !== appLocales.jaJP.locale) {
      if (value.en !== undefined) {
        return value.en;
      }
    }

    // それ以外は日本語
    return value.ja;
  }
}
