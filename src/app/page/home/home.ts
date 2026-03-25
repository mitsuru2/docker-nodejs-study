import { Component, computed, inject, signal } from '@angular/core';
import { AppManager } from '../../service/app-manager/app-manager';
import { Splash } from '../../feature/splash/splash';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { delay, filter, tap } from 'rxjs';
import { ButtonConfigData } from '../../ui/button/button.interface';

@Component({
  selector: 'app-home',
  imports: [Splash],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly className = 'Home';

  private app = inject(AppManager);

  // 制御パラメータ
  protected initProgress = computed(() => {
    if (this.app.isInit()) {
      return 100;
    } else {
      return 5;
    }
  });
  protected showSplash = signal(!this.app.isInit());
  protected showMain = signal(this.app.isInit());

  protected button: ButtonConfigData = {
    id: 'button',
    label: 'Toggle',
  };

  protected buttonClickHandler() {
    this.showSplash.set(!this.showSplash());
  }

  constructor() {
    // 初期化進捗が100になったら2秒待ってからスプラッシュを非表示にする。
    // プログレスバーのアニメーションを完了させるため。
    // effect()と非同期処理との組み合わせはアンチパターンのためObservableで処理。
    toObservable(this.initProgress)
      .pipe(
        filter((progress) => progress === 100),
        delay(1200),
        tap(() => {
          this.showSplash.set(false);
        }),
        delay(500),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.showMain.set(true);
      });
  }
}
