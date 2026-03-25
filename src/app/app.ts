import { ApplicationRef, Component, inject, OnInit } from '@angular/core';
import { EventType, Router, RouterOutlet } from '@angular/router';
import { filter, first } from 'rxjs';
import { Logger } from './utility/logger/logger';
import { AppManager } from './service/app-manager/app-manager';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly className = 'App';

  // 依存サービス
  private readonly router = inject(Router);
  private readonly appRef = inject(ApplicationRef);
  private readonly app = inject(AppManager);

  // SSR -> CSR の切り替わりでの意図しないアニメーションへの対策。
  // アプリケーションがCSRモードになるまでアニメーションを抑制するフラグ。
  protected animationDisabled = true;

  //----------------------------------------------------------------------------
  // 生成・消滅
  //
  constructor() {
    Logger.debug(`New ${this.className}()`);

    // ルーターイベントの監視開始。
    // コンポーネントではなく、システム全体の初期化に関するものなので、コンストラクタで初期化。
    this.startRouterEventMonitoring();

    // アプリのハイドレーション完了タイミングの監視。
  }

  ngOnInit(): void {
    Logger.debug(`${this.className}.ngOnInit()`);
    this.app.initialize(); // 非同期の初期化処理を開始。ngOnInitは完了を待たずに終了。
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

  private startHydrationStatusMonitoring() {
    // ルーターイベントのフィルタリング
    const observable = this.appRef.isStable.pipe(
      first((stable) => stable), // 最初にtrueになった時にイベント発行
      takeUntilDestroyed(), // コンポーネント破棄時にクリーンアップ
    );

    // ルーターイベントの購読
    // Appコンポーネントはアプリの生存期間中ずっと生きているのでunsubscribe()不要。
    observable.subscribe(() => {
      Logger.info(`AppRef > Hydration complete.}`);
      this.animationDisabled = false;
    });
  }
}
