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
import { i18nLabels } from '../../../locale/_i18n_';

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
  private logger = inject(Logger);

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
        alt: i18nLabels.home.requirementAnalysis.toLowerCase(),
        path: 'images/requirement.png',
        title: i18nLabels.home.requirementAnalysis,
      },
      {
        id: 'arch-design',
        alt: i18nLabels.home.systemDesign.toLowerCase(),
        path: 'images/system-design.png',
        title: i18nLabels.home.systemDesign,
      },
      {
        id: 'front-end',
        alt: i18nLabels.home.frontEndDevelopment.toLowerCase(),
        path: 'images/front-end.png',
        title: i18nLabels.home.frontEndDevelopment,
      },
      {
        id: 'ci',
        alt: i18nLabels.home.continuousIntegration.toLocaleLowerCase(),
        path: 'images/continuous-integration.png',
        title: i18nLabels.home.continuousIntegration,
      },
      {
        id: 'diag',
        alt: i18nLabels.home.vehicleDiagnostics.toLocaleLowerCase(),
        path: 'images/vehicle-diagnostics.png',
        title: i18nLabels.home.vehicleDiagnostics,
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
    this.logger.info(`${location} id=${event.id}`);
  }
}
