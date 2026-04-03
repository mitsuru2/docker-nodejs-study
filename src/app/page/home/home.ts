import { Component, computed, DestroyRef, DOCUMENT, inject, OnInit, signal } from '@angular/core';
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
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CardModule } from 'primeng/card';
import { CardWithButton } from '../../ui/card-with-button/card-with-button';
import { CardWithButtonConfigData } from '../../ui/card-with-button/card-with-button.interface';
import { PrimeIcons } from 'primeng/api';
import { SkillMenuItem } from './home.interface';

interface CardContentData {
  id: string;
  catchCopy: string;
  messages: string[];
  card: CardWithButtonConfigData;
}

@Component({
  selector: 'app-home',
  imports: [Splash, AppShell, Carousel, AnimateOnScrollModule, CardModule, CardWithButton],
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

  // 依存トークン
  private document = inject(DOCUMENT);

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

  // GUIテキスト
  protected readonly labels = i18nLabels;

  // トップ画像カルーセル
  protected readonly carouselPC: CarouselConfigData = {
    images: [
      {
        id: SkillMenuItem.diag,
        alt: i18nLabels.skills.diag.title.toLocaleLowerCase(),
        path: 'images/vehicle-diagnostics.png',
        title: i18nLabels.skills.diag.title,
      },
      {
        id: SkillMenuItem.frontEnd,
        alt: i18nLabels.skills.frontEnd.title.toLowerCase(),
        path: 'images/front-end.png',
        title: i18nLabels.skills.frontEnd.title,
      },
      {
        id: SkillMenuItem.ci,
        alt: i18nLabels.skills.ci.title.toLocaleLowerCase(),
        path: 'images/continuous-integration.png',
        title: i18nLabels.skills.ci.title,
      },
      {
        id: SkillMenuItem.systemDesign,
        alt: i18nLabels.skills.ci.title.toLowerCase(),
        path: 'images/system-design.png',
        title: i18nLabels.skills.ci.title,
      },
      {
        id: SkillMenuItem.userReq,
        alt: i18nLabels.skills.userReq.title.toLowerCase(),
        path: 'images/requirement.png',
        title: i18nLabels.skills.userReq.title,
      },
    ],
    interval: 6000,
    showDots: true,
    showOverlay: true,
  };
  protected readonly carouselMobile = { ...this.carouselPC, showDots: false, showOverlay: false };
  protected carousel = computed(() => (this.isMobile() ? this.carouselMobile : this.carouselPC));

  // 本文カード
  private readonly detailButton = {
    label: i18nLabels.common.detail,
    icon: PrimeIcons.SEARCH_PLUS,
  } as const;
  protected readonly cardContents: CardContentData[] = [
    {
      id: `card-${SkillMenuItem.diag}`,
      catchCopy: i18nLabels.skills.diag.subTitle,
      messages: [i18nLabels.skills.diag.description],
      card: {
        title: i18nLabels.skills.diag.title,
        button: { ...this.detailButton, id: SkillMenuItem.diag },
      },
    },
    {
      id: `card-${SkillMenuItem.frontEnd}`,
      catchCopy: i18nLabels.skills.frontEnd.subTitle,
      messages: [i18nLabels.skills.frontEnd.description],
      card: {
        title: i18nLabels.skills.frontEnd.title,
        button: { ...this.detailButton, id: SkillMenuItem.frontEnd },
      },
    },
    {
      id: `card-${SkillMenuItem.ci}`,
      catchCopy: i18nLabels.skills.ci.subTitle,
      messages: [i18nLabels.skills.ci.description],
      card: {
        title: i18nLabels.skills.ci.title,
        button: { ...this.detailButton, id: SkillMenuItem.ci },
      },
    },
    {
      id: `card-${SkillMenuItem.systemDesign}`,
      catchCopy: i18nLabels.skills.systemDesign.subTitle,
      messages: [i18nLabels.skills.systemDesign.description],
      card: {
        title: i18nLabels.skills.systemDesign.title,
        button: { ...this.detailButton, id: SkillMenuItem.systemDesign },
      },
    },
    {
      id: `card-${SkillMenuItem.userReq}`,
      catchCopy: i18nLabels.skills.userReq.subTitle,
      messages: [i18nLabels.skills.userReq.description],
      card: {
        title: i18nLabels.skills.userReq.title,
        button: { ...this.detailButton, id: SkillMenuItem.userReq },
      },
    },
  ];

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

    // クリックされた画像に対応するカードエレメント取得
    const element = this.document.getElementById(`card-${event.id}`);
    if (!element) {
      this.logger.error(`${location} card is null`);
      return;
    }

    // 取得したカードエレメントまで移動
    element.scrollIntoView({ behavior: 'smooth' });

    // 強調アニメーションスタイルを適用。アニメーション終了後に削除。
    element.classList.add('selected-card');
    setTimeout(() => element.classList.remove('selected-card'), 2000);
  }
}
