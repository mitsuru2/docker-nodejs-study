import { Injectable, signal } from '@angular/core';
import { Logger } from '../../utility/logger/logger';
import { sleep } from '../../utility/sleep/sleep';

@Injectable({
  providedIn: 'root',
})
export class AppManager {
  private readonly className = 'AppManager';

  isInit = signal(false);

  //----------------------------------------------------------------------------
  // 生成・消滅
  //
  constructor() {
    Logger.debug(`New ${this.className}()`);
  }

  initialize = async () => {
    const location = `${this.className}.init()`;
    Logger.debug(`${location}`);

    // ダミー処理
    await sleep(2000);

    // 初期化フラグ設定
    this.isInit.set(true);
  };
}
