import { DOCUMENT, inject, Injectable, PLATFORM_ID, REQUEST, signal } from '@angular/core';
import { Logger } from '../../utility/logger/logger';
import { sleep } from '../../utility/sleep/sleep';
import { appLocales, LocaleId } from '../../model/locale';
import { DomManager } from '../dom-manager/dom-manager';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AppManager {
  private readonly className = 'AppManager';

  // 依存サービス
  private dom = inject(DomManager);

  // 依存トークン
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private request = inject(REQUEST, { optional: true });

  // 初期化フラグ
  isInit = signal(false);

  // 設定情報
  locale = signal<LocaleId>('jaJP');

  //----------------------------------------------------------------------------
  // 生成・消滅
  //
  constructor() {
    Logger.debug(`New ${this.className}()`);
  }

  //----------------------------------------------------------------------------
  // システム初期化処理
  //
  initialize = async () => {
    const location = `${this.className}.init()`;
    Logger.debug(`${location}`);

    // 言語設定
    const locale = this.getDefaultLocale();
    this.setLocale(locale);

    // ダミー処理
    await sleep(2000);

    // 初期化フラグ設定
    this.isInit.set(true);
  };

  private getDefaultLocale(): LocaleId {
    const location = `${this.className}.getDefaultLocale()`;

    // ブラウザの表示言語を取得
    let browserLang: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      browserLang = navigator.language;
    } else {
      const acceptLang = this.request?.headers.get('accept-language');
      browserLang = acceptLang ? acceptLang.split(',')[0] : null;
    }

    // 日本語がふくまれていれば日本語。それ以外は英語。
    const defaultLocale = browserLang?.toLowerCase().includes('ja') ? 'jaJP' : 'enGB';

    // ログ出力してリターン
    Logger.info(`${location} Browser lang=${browserLang}, Locale=${defaultLocale}`);
    return defaultLocale;
  }

  //----------------------------------------------------------------------------
  // 言語設定
  //
  setLocale(locale: LocaleId) {
    const location = `${this.className}.setLocale()`;
    Logger.info(`${location} Locale=${locale}`);

    // 翻訳サービス設定

    // index.htmlの言語プロパティ更新
    // SSR環境を考慮してDOCUMENTトークン経由でアクセス。
    this.dom.setAttribute(this.document.documentElement, 'lang', appLocales[locale].language);

    // 設定情報更新
    this.locale.set(locale);
  }
}
