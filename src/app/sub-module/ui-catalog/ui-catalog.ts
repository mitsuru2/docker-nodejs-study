import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { PresentationalComponentType, UiCatalogItemData } from './ui-catalog.interface';
import { TestExperience } from '../../feature/experience/test-experience/test-experience';
import { TestArticle } from '../../feature/article/test-article/test-article';
import { TestCardWithButton } from '../../ui/card-with-button/test-card-with-button/test-card-with-button';
import { TestLocaleSelect } from '../../ui/locale-select/test-locale-select/test-locale-select';
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
    TestExperience,
    TestArticle,
    TestCardWithButton,
    TestLocaleSelect,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
    { type: PresentationalComponentType.Feature, name: 'Experience', id: 'experience' },
    { type: PresentationalComponentType.Feature, name: 'Article', id: 'article' },
    { type: PresentationalComponentType.UI, name: 'Card With Button', id: 'card-with-button' },
    { type: PresentationalComponentType.UI, name: 'Locale Select', id: 'locale-select' },
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
