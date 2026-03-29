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
import { Button } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CountryFlag } from '../../ui/country-flag/country-flag';

@Component({
  selector: 'app-app-shell',
  imports: [MenubarModule, LocaleSelect, Button, MenuModule, CountryFlag],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell implements OnInit {
  private readonly className = 'AppShell';

  // 依存サービス
  private app = inject(AppManager);
  private bpObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  // 出力イベント
  @Output() clicked = new EventEmitter<AppShellOutputData>();

  // メニュー
  protected readonly menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: PrimeIcons.HOME,
      routerLink: '/' + PagePath.Home,
    },
    {
      label: 'Skills',
      icon: PrimeIcons.WRENCH,
    },
    {
      label: 'Career',
      icon: PrimeIcons.BRIEFCASE,
    },
  ];

  // 言語選択
  protected locale = computed(() => appLocales[this.app.locale()]);
  protected localeSelect: LocaleSelectConfigData = { type: 'language' };
  protected readonly localeMenuItems: MenuItem[] = [
    {
      label: appLocales.jaJP.languageName,
      id: appLocales.jaJP.id,
      command: () => this.localeChanged(appLocales.jaJP),
    },
    {
      label: appLocales.enGB.languageName,
      id: appLocales.enGB.id,
      command: () => this.localeChanged(appLocales.enGB),
    },
  ];

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
    Logger.debug(`${this.className}.localeChanged() locale=${locale.id}`);
    this.app.setLocale(locale.id);
  }
}
