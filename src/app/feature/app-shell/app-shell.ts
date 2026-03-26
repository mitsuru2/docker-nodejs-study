import { Component, EventEmitter, Output } from '@angular/core';
import { getCurrentYear } from '../../utility/timestamp/timestamp';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { ScrollTopModule } from 'primeng/scrolltop';
import { AppShellOutputData, MenuItemId } from './app-shell.interface';

@Component({
  selector: 'app-app-shell',
  imports: [MenubarModule, ScrollTopModule],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly className = 'AppShell';

  // 出力イベント
  @Output() clicked = new EventEmitter<AppShellOutputData>();

  // メニュー
  protected readonly menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: PrimeIcons.HOME,
      command: () => {
        this.menuClicked(MenuItemId.Home);
      },
    },
    {
      label: 'Skills',
      icon: PrimeIcons.WRENCH,
      command: () => {
        this.menuClicked(MenuItemId.Skills);
      },
    },
    {
      label: 'Projects',
      icon: PrimeIcons.BRIEFCASE,
      command: () => {
        this.menuClicked(MenuItemId.Projects);
      },
    },
  ];

  // フッター
  protected readonly firstYear = 2026;
  protected readonly currentYear = getCurrentYear();

  // メニュークリック処理
  private menuClicked(id: string) {
    this.clicked.emit({ id });
  }
}
