import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AppManager } from '../../service/app-manager/app-manager';
import { Splash } from '../../feature/splash/splash';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { delay, filter, tap } from 'rxjs';
import { AppShell } from '../../feature/app-shell/app-shell';
import { Router } from '@angular/router';
import { Logger } from '../../utility/logger/logger';
import { Carousel } from '../../ui/carousel/carousel';
import { CarouselConfigData, CarouselOutputData } from '../../ui/carousel/carousel.interface';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DesignTokens } from '../../../styles';

@Component({
  selector: 'app-home',
  imports: [Splash, AppShell, Carousel],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly className = 'Home';

  // 依存サービス
  private app = inject(AppManager);
  private router = inject(Router);
  private bpObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  // スプラッシュ制御パラメータ
  protected initProgress = computed(() => {
    if (this.app.isInit()) {
      return 100;
    } else {
      return 5;
    }
  });
  protected showSplash = signal(!this.app.isInit());
  protected showMain = signal(this.app.isInit());

  // ホーム画面制御パラメータ
  protected isMobile = signal(false);

  // トップ画像カルーセル
  protected readonly carouselPC: CarouselConfigData = {
    images: [
      {
        id: 'user-req',
        alt: 'solution definition and proposal',
        path: 'images/requirement.png',
        title: 'Solution Definition & Proposal',
      },
      {
        id: 'arch-design',
        alt: 'system architecture design',
        path: 'images/system-design.png',
        title: 'System Architecture Design',
      },
      {
        id: 'front-end',
        alt: 'front-end development',
        path: 'images/front-end.png',
        title: 'Front-End Development',
      },
      {
        id: 'ci',
        alt: 'development workflow & ci/cd',
        path: 'images/continuous-integration.png',
        title: 'Development Workflow & CI/CD',
      },
      {
        id: 'diag',
        alt: 'vehicle diagnostics & autosar',
        path: 'images/vehicle-diagnostics.png',
        title: 'Vehicle Diagnostics & Autosar',
      },
    ],
    interval: 6000,
    showDots: true,
    showOverlay: true,
  };
  protected readonly carouselMobile = { ...this.carouselPC, showDots: false, showOverlay: false };
  protected carousel = computed(() => (this.isMobile() ? this.carouselMobile : this.carouselPC));

  //----------------------------------------------------------------------------
  // ライフサイクル
  //
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

  ngOnInit(): void {
    // ブレークポイント監視 --> isMobileシグナルに反映
    this.bpObserver
      .observe([`(max-width: ${DesignTokens.primitive.custom.bp.mobile})`])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.isMobile.set(state.matches);
      });
  }

  protected carouselClickedHandler(event: CarouselOutputData) {
    const location = `${this.className}.carouselClickedHandler()`;
    Logger.info(`${location} id=${event.id}`);
  }
}
