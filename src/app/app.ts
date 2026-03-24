import { Component, inject } from '@angular/core';
import { EventType, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Logger } from './utility/logger/logger';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly className = 'App';
  private readonly router = inject(Router);

  //----------------------------------------------------------------------------
  // 生成・消滅
  //
  constructor() {
    Logger.debug(`New ${this.className}()`);

    // ルーターイベントの監視開始。
    // コンポーネントではなく、システム全体の初期化に関するものなので、コンストラクタで初期化。
    this.startRouterEventMonitoring();
  }

  /**
   * ルーターによるページ遷移イベントを監視してログに記録する。
   * ページ遷移要求とその結果 (成功, エラー, キャンセル) を記録する。
   */
  private startRouterEventMonitoring() {
    // ルーターイベントのフィルタリング
    const observable = this.router.events.pipe(
      filter((event) => {
        const type = event.type;
        if (
          [
            EventType.NavigationStart, // 遷移開始
            EventType.NavigationEnd, // 遷移終了 (成功)
            EventType.NavigationError, // エラー
            EventType.NavigationCancel, // キャンセル (ガードではじかれた)
          ].includes(type)
        ) {
          return true;
        } else {
          return false;
        }
      }),
    );

    // ルーターイベントの購読
    // Appコンポーネントはアプリの生存期間中ずっと生きているのでunsubscribe()不要。
    observable.subscribe((event) => {
      Logger.info(`Router > ${event.toString()}`);
    });
  }
}
