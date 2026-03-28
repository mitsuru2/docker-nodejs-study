import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { PresentationalComponentType, UiCatalogItemData } from './ui-catalog.interface';
import { TestCountryFlag } from '../../ui/country-flag/test-country-flag/test-country-flag';
import { TestCarousel } from '../../ui/carousel/test-carousel/test-carousel';
import { TestAppShell } from '../../feature/app-shell/test-app-shell/test-app-shell';
import { TestSplash } from '../../feature/splash/test-splash/test-splash';
import { TestProgressBar } from '../../ui/progress-bar/test-progress-bar/test-progress-bar';
import { TestCircularProgressBar } from '../../ui/circular-progress-bar/test-circular-progress-bar/test-circular-progress-bar';
import { TestCircularImage } from '../../ui/circular-image/test-circular-image/test-circular-image';

@Component({
  selector: 'app-root', // index.htmlを共通としているためセレクタを修正。
  imports: [
    TestCountryFlag,
    TestCarousel,
    TestAppShell,
    TestSplash,
    TestProgressBar,
    TestCircularProgressBar,
    TestCircularImage,
    ButtonModule,
    MenuModule,
    FormsModule,
    AccordionModule,
  ],
  templateUrl: './ui-catalog.html',
  styleUrl: './ui-catalog.scss',
})
export class UiCatalog {
  private readonly className = 'UiCatalog';

  // パネル制御
  protected readonly ComponentType = PresentationalComponentType;
  protected activeValue = PresentationalComponentType.UI;
  protected selectedId = '';

  // UIパーツリスト
  protected readonly items: UiCatalogItemData[] = [
    { type: PresentationalComponentType.UI, name: 'Country Flag', id: 'country-flag' },
    { type: PresentationalComponentType.UI, name: 'Carousel', id: 'carousel' },
    { type: PresentationalComponentType.Feature, name: 'App Shell', id: 'app-shell' },
    { type: PresentationalComponentType.Feature, name: 'Splash', id: 'splash' },
    { type: PresentationalComponentType.UI, name: 'Progress Bar', id: 'progress-bar' },
    {
      type: PresentationalComponentType.UI,
      name: 'Circular Progress Bar',
      id: 'circular-progress-bar',
    },
    { type: PresentationalComponentType.UI, name: 'Circular Image', id: 'circular-image' },
  ];
  protected readonly uiItems: MenuItem[] = this.items
    .filter((item) => item.type === PresentationalComponentType.UI)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({ label: item.name, command: () => (this.selectedId = item.id) }));
  protected readonly featureItems = this.items
    .filter((item) => item.type === PresentationalComponentType.Feature)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({ label: item.name, command: () => (this.selectedId = item.id) }));
  protected readonly mobileItems = [
    {
      label: 'UI',
      items: this.uiItems,
    },
    {
      label: 'Feature',
      items: this.featureItems,
    },
  ];
}
