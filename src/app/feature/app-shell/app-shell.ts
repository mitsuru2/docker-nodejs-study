import {
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { getCurrentYear } from '../../utility/timestamp/timestamp';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Home, Book, Briefcase, Globe, Check } from '@primeicons/angular';
import { AppShellOutputData } from './app-shell.interface';
import { PagePath } from '../../model/page-path';
import { LocaleSelect } from '../../ui/locale-select/locale-select';
import { appLocales, LocaleData } from '../../model/locale';
import { LocaleSelectConfigData } from '../../ui/locale-select/locale-select.interface';
import { AppManager } from '../../service/app-manager/app-manager';
import { Logger } from '../../utility/logger/logger';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DesignTokens } from '../../../styles';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MenuModule } from 'primeng/menu';
import { CountryFlag } from '../../ui/country-flag/country-flag';
import { i18nLabels } from '../../../locale/_i18n_';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-shell',
  imports: [
    MenubarModule,
    LocaleSelect,
    ButtonModule,
    MenuModule,
    CountryFlag,
    ButtonGroupModule,
    Home,
    Book,
    Briefcase,
    Globe,
    Check,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell implements OnInit {
  private readonly className = 'AppShell';

  // テキストデータ
  protected labels = i18nLabels;

  // デザイントークン
  protected designTokens = DesignTokens;

  // 依存サービス
  private app = inject(AppManager);
  private bpObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  private logger = inject(Logger);
  private router = inject(Router);

  // 出力イベント
  @Output() clicked = new EventEmitter<AppShellOutputData>();

  // メニュー
  protected readonly menuItems: MenuItem[] = [
    {
      label: this.labels.common.home,
      icon: PrimeIcons.HOME,
      routerLink: '/' + PagePath.Home,
    },
    {
      label: this.labels.common.career,
      icon: PrimeIcons.BRIEFCASE,
      routerLink: '/' + PagePath.Career,
    },
    {
      label: this.labels.common.skills,
      icon: PrimeIcons.BOOK,
      items: [
        {
          label: this.labels.skills.diag.title,
          icon: PrimeIcons.CAR,
          routerLink: '/' + PagePath.Diag,
        },
        {
          label: this.labels.skills.userReq.title,
          icon: PrimeIcons.COMMENTS,
          routerLink: '/' + PagePath.UserReq,
        },
        {
          label: this.labels.skills.systemDesign.title,
          icon: PrimeIcons.SITEMAP,
          routerLink: '/' + PagePath.SystemDesign,
        },
        {
          label: this.labels.skills.ci.title,
          icon: PrimeIcons.SYNC,
          routerLink: '/' + PagePath.Ci,
        },
        {
          label: this.labels.skills.frontEnd.title,
          icon: PrimeIcons.PALETTE,
          routerLink: '/' + PagePath.FrontEnd,
        },
      ],
    },
  ];

  // 言語選択
  protected locale = computed(() => appLocales[this.app.localeId()]);
  protected localeSelect: LocaleSelectConfigData = { type: 'language' };
  protected readonly localeMenuItems: MenuItem[] = Object.values(appLocales).map(
    (data): MenuItem => ({
      label: data.languageName,
      id: data.id,
      command: () => this.localeChanged(data),
    }),
  );

  // フッター
  protected readonly firstYear = 2026;
  protected readonly currentYear = getCurrentYear();

  // レイアウト制御
  protected isMobile = signal(false);

  //----------------------------------------------------------------------------
  // ライフサイクル
  //
  ngOnInit(): void {
    // ブレークポイント監視 --> isMobileシグナルに反映
    this.bpObserver
      .observe([`(max-width: ${DesignTokens.primitive.custom.bp.mobile})`])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.isMobile.set(state.matches);
      });
  }

  //----------------------------------------------------------------------------
  // 言語変更イベント
  //
  protected localeChanged(locale: LocaleData) {
    this.logger.debug(`${this.className}.localeChanged() locale=${locale.id}`);
    this.app.switchLocale(locale.id);
  }

  //----------------------------------------------------------------------------
  // ボタンクリックイベント (for mobile)
  //
  protected menuClicked(link: string) {
    if (link) {
      this.router.navigate([link]);
    }
  }
}
