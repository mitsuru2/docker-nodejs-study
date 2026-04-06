import { inject, Injectable, LOCALE_ID, PLATFORM_ID, signal } from '@angular/core';
import { Logger } from '../../utility/logger/logger';
import { sleep } from '../../utility/sleep/sleep';
import { appLocales, LocaleId } from '../../model/locale';
import { isPlatformBrowser, Location } from '@angular/common';
import { NAVIGATOR, WINDOW } from '../../model/custom-tokens';

@Injectable({
  providedIn: 'root',
})
export class AppManager {
  private readonly className = 'AppManager';

  // 依存サービス
  private location = inject(Location);
  private logger = inject(Logger);

  // 依存トークン
  private activeLocale = inject(LOCALE_ID);
  private window = inject(WINDOW);
  private navigator = inject(NAVIGATOR);
  private platformId = inject(PLATFORM_ID);

  // 公開プロパティ
  isInit = signal(false); // 初期化フラグ
  localeId = signal<LocaleId>(this.activeLocale.startsWith('ja') ? 'jaJP' : 'enGB'); // ロケールID

  //----------------------------------------------------------------------------
  // 生成・消滅
  //
  constructor() {
    this.logger.debug(`New ${this.className}()`);
  }

  //----------------------------------------------------------------------------
  // システム初期化処理
  //
  async initialize() {
    const location = `${this.className}.initialize()`;
    this.logger.debug(`${location}`);
    this.logger.info(
      `${location} Angular active locale: ${this.activeLocale}, Browser language: ${this.navigator.language}`,
    );

    // ダミー処理 (ブラウザでの動作確認用。サーバー側ではスキップしてレスポンス速度を優先)
    if (isPlatformBrowser(this.platformId)) {
      await sleep(500);
      // 初期化フラグ設定
      this.isInit.set(true);
    }
  }

  //----------------------------------------------------------------------------
  // 言語設定
  //
  /**
   * 指定したロケールのページにリダイレクトする。
   * @param locale ロケールの内部ID。appLocales参照。
   */
  switchLocale(locale: LocaleId) {
    const location = `${this.className}.switchLocale()`;

    // 現在のロケールと同じなら何もしない。
    const targetLocale = appLocales[locale].locale;
    if (this.activeLocale === targetLocale) {
      this.logger.info(`${location} Same locale is input. Do nothing.`);
      return;
    }

    // 現在のパスを取得。
    const curPath = this.location.path();

    // 新しいパスを作成。
    let newPath = curPath.replace(`/${this.activeLocale}`, `/${targetLocale}`);
    if (!newPath.startsWith(`/${targetLocale}`)) {
      if (newPath.startsWith('/')) {
        newPath = `/${targetLocale}${newPath}`;
      } else {
        newPath = `/${targetLocale}/${newPath}`;
      }
    }
    this.logger.debug(`${location} curPath=${curPath}, newPath=${newPath}`);

    // 新しいパスに遷移
    // JavaScriptの入替を伴うリロードなのでRouterでのページ遷移ではなく
    // ブラウザのネイティブなページ遷移を実行。
    if (this.window && this.window.location) {
      this.window.location.href = newPath;
    }
  }
}
