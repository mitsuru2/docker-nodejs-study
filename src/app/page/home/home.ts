import { Component, computed, DOCUMENT, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppManager } from '../../service/app-manager/app-manager';
import { Splash } from '../../feature/splash/splash';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay, filter, map, tap } from 'rxjs';
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
import {
  CardWithButtonConfigData,
  CardWithButtonOutputData,
} from '../../ui/card-with-button/card-with-button.interface';
import { PrimeIcons } from 'primeng/api';
import { SkillMenuItem } from './home.interface';
import { PagePath } from '../../model/page-path';
import { CardLeadData, MessageData } from '../../model/db-data';
import { LocalizePipe } from '../../pipe/localize/localize-pipe';

interface CardContentData {
  id: string;
  catchCopy?: MessageData;
  messages: MessageData[];
  card: CardWithButtonConfigData;
}

@Component({
  selector: 'app-home',
  imports: [
    Splash,
    AppShell,
    Carousel,
    AnimateOnScrollModule,
    CardModule,
    CardWithButton,
    LocalizePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly className = 'Home';

  // 依存サービス
  private app = inject(AppManager);
  private router = inject(Router);
  private bpObserver = inject(BreakpointObserver);
  private logger = inject(Logger);
  private http = inject(HttpClient);

  // 依存トークン
  private document = inject(DOCUMENT);

  // スプラッシュ制御パラメータ
  private loadedImagePaths = signal(new Set<string>());
  protected initProgress = computed(() => {
    // AppManagerの初期化完了、または全画像のロード完了で100%にする
    let progress = this.loadedImagePaths().size / this.carousel().images.length;
    if (progress >= 1 && !this.app.isInit()) {
      progress = 0.99; // AppManagerの初期化が完了するまでは99%で止めておく
    }
    return Math.floor(progress * 100);
  });
  protected showSplash = signal(!this.app.isInit());
  protected showMain = signal(this.app.isInit());

  // ホーム画面制御パラメータ
  private readonly mobileQuery = `(max-width: ${DesignTokens.primitive.custom.bp.mobile})`;
  protected isMobile = toSignal(
    this.bpObserver.observe([this.mobileQuery]).pipe(map((state) => state.matches)),
    { initialValue: this.bpObserver.isMatched(this.mobileQuery) },
  );

  // GUIテキスト
  protected readonly labels = i18nLabels;

  // トップ画像カルーセル
  protected readonly carouselPC: CarouselConfigData = {
    images: [
      {
        id: PagePath.Career,
        alt: i18nLabels.career.experience.toLocaleLowerCase(),
        path: 'images/career.webp',
        title: i18nLabels.career.experience,
      },
      {
        id: SkillMenuItem.diag,
        alt: i18nLabels.skills.diag.title.toLocaleLowerCase(),
        path: 'images/vehicle-diagnostics.webp',
        title: i18nLabels.skills.diag.title,
      },
      {
        id: SkillMenuItem.userReq,
        alt: i18nLabels.skills.userReq.title.toLowerCase(),
        path: 'images/requirement.webp',
        title: i18nLabels.skills.userReq.title,
      },
      {
        id: SkillMenuItem.systemDesign,
        alt: i18nLabels.skills.systemDesign.title.toLowerCase(),
        path: 'images/system-design.webp',
        title: i18nLabels.skills.systemDesign.title,
      },
      {
        id: SkillMenuItem.ci,
        alt: i18nLabels.skills.ci.title.toLocaleLowerCase(),
        path: 'images/continuous-integration.webp',
        title: i18nLabels.skills.ci.title,
      },
      {
        id: SkillMenuItem.frontEnd,
        alt: i18nLabels.skills.frontEnd.title.toLowerCase(),
        path: 'images/front-end.webp',
        title: i18nLabels.skills.frontEnd.title,
      },
    ],
    interval: 5000,
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
  private readonly cardLeadJsonPath = 'data/home-cards.json';
  private cardLeads = toSignal(this.http.get<CardLeadData[]>(this.cardLeadJsonPath), {
    initialValue: [],
  });
  protected cardContents = computed<CardContentData[]>(() => {
    const leads = this.cardLeads();
    const findLead = (pk: string) => leads.find((l) => l.pk === pk);
    return [
      {
        id: `card-${SkillMenuItem.diag}`,
        catchCopy: findLead(SkillMenuItem.diag)?.catchCopy,
        messages: findLead(SkillMenuItem.diag)?.messages ?? [],
        card: {
          title: i18nLabels.skills.diag.title,
          button: { ...this.detailButton, id: SkillMenuItem.diag },
        },
      },
      {
        id: `card-${SkillMenuItem.userReq}`,
        catchCopy: findLead(SkillMenuItem.userReq)?.catchCopy,
        messages: findLead(SkillMenuItem.userReq)?.messages ?? [],
        card: {
          title: i18nLabels.skills.userReq.title,
          button: { ...this.detailButton, id: SkillMenuItem.userReq },
        },
      },
      {
        id: `card-${SkillMenuItem.systemDesign}`,
        catchCopy: findLead(SkillMenuItem.systemDesign)?.catchCopy,
        messages: findLead(SkillMenuItem.systemDesign)?.messages ?? [],
        card: {
          title: i18nLabels.skills.systemDesign.title,
          button: { ...this.detailButton, id: SkillMenuItem.systemDesign },
        },
      },
      {
        id: `card-${SkillMenuItem.ci}`,
        catchCopy: findLead(SkillMenuItem.ci)?.catchCopy,
        messages: findLead(SkillMenuItem.ci)?.messages ?? [],
        card: {
          title: i18nLabels.skills.ci.title,
          button: { ...this.detailButton, id: SkillMenuItem.ci },
        },
      },
      {
        id: `card-${SkillMenuItem.frontEnd}`,
        catchCopy: findLead(SkillMenuItem.frontEnd)?.catchCopy,
        messages: findLead(SkillMenuItem.frontEnd)?.messages ?? [],
        card: {
          title: i18nLabels.skills.frontEnd.title,
          button: { ...this.detailButton, id: SkillMenuItem.frontEnd },
        },
      },
      {
        id: `card-${PagePath.Career}`,
        messages: findLead(PagePath.Career)?.messages ?? [],
        card: {
          title: i18nLabels.career.experience,
          button: { ...this.detailButton, id: PagePath.Career },
        },
      },
    ];
  });

  //----------------------------------------------------------------------------
  // ライフサイクル
  //
  constructor() {
    // 初期化進捗が100になったら1.2秒待ってからスプラッシュを非表示にする。その後0.6秒待ってからメイン画面を表示する。
    // プログレスバーのアニメーションを完了させるため。
    // effect()と非同期処理との組み合わせはアンチパターンのためObservableで処理。
    toObservable(this.initProgress)
      .pipe(
        filter((progress) => progress === 100),
        delay(1200),
        tap(() => {
          this.showSplash.set(false);
        }),
        delay(600),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.showMain.set(true);
      });
  }

  /**
   * ダミー画像の読み込み完了イベントハンドラ
   */
  protected onImageLoad(path: string): void {
    this.logger.info(`${this.className}.onImageLoad() path=${path}`);
    this.loadedImagePaths.update((set) => (set.has(path) ? set : new Set(set.add(path))));
  }

  //----------------------------------------------------------------------------
  // カルーセル
  //
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

  //----------------------------------------------------------------------------
  // カード
  //
  protected cardClickedHandler(event: CardWithButtonOutputData) {
    const location = `${this.className}.cardClickedHandler()`;
    this.logger.info(`${location} id=${event.id}`);

    if (event.id === SkillMenuItem.frontEnd) {
      this.router.navigate(['/' + PagePath.FrontEnd]);
    } else if (event.id === SkillMenuItem.ci) {
      this.router.navigate(['/' + PagePath.Ci]);
    } else if (event.id === SkillMenuItem.diag) {
      this.router.navigate(['/' + PagePath.Diag]);
    } else if (event.id === SkillMenuItem.systemDesign) {
      this.router.navigate(['/' + PagePath.SystemDesign]);
    } else if (event.id === SkillMenuItem.userReq) {
      this.router.navigate(['/' + PagePath.UserReq]);
    } else if (event.id === PagePath.Career) {
      this.router.navigate(['/' + PagePath.Career]);
    } else {
      this.logger.warn(`${location} Not implementd. id=${event.id}`);
    }
  }
}
