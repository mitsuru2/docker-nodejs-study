import { ApplicationRef, Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EventType, Router, RouterOutlet } from '@angular/router';
import { filter, first } from 'rxjs';
import { Logger } from './utility/logger/logger';
import { AppManager } from './service/app-manager/app-manager';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrollTopModule],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly className = 'App';

  // 依存サービス
  private readonly router = inject(Router);
  private readonly appRef = inject(ApplicationRef);
  private readonly app = inject(AppManager);
  private readonly logger = inject(Logger);

  //----------------------------------------------------------------------------
  // 生成・消滅
  //
  constructor() {
    this.logger.debug(`New ${this.className}()`);

    // ルーターイベントの監視開始。
    // コンポーネントではなく、システム全体の初期化に関するものなので、コンストラクタで初期化。
    this.startRouterEventMonitoring();

    // アプリのハイドレーション完了タイミングの監視。
    this.startHydrationStatusMonitoring();
  }

  ngOnInit(): void {
    this.logger.debug(`${this.className}.ngOnInit()`);
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
      this.logger.info(`Router > ${event.toString()}`);
    });
  }

  private startHydrationStatusMonitoring() {
    // ルーターイベントの購読
    this.appRef.isStable
      .pipe(
        first((stable) => stable), // 最初にtrueになった時にイベント発行
        takeUntilDestroyed(), // コンポーネント破棄時にクリーンアップ
      )
      .subscribe(() => {
        this.logger.info(`AppRef > Hydration complete.`);
      });
  }
}
