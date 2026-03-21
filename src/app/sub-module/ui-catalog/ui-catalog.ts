import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PresentationalComponentType, UiCatalogItemData } from './ui-catalog.interface';
import { TestCircularProgressBar } from '../../ui/circular-progress-bar/test-circular-progress-bar/test-circular-progress-bar';
import { TestCircularImage } from '../../ui/circular-image/test-circular-image/test-circular-image';
import { TestButton } from '../../ui/button/test-button/test-button';

@Component({
  selector: 'app-root', // index.htmlを共通としているためセレクタを修正。
  imports: [
    TestCircularProgressBar,
    TestCircularImage,
    TestButton,
    MenuModule,
    FormsModule,
    AccordionModule,
    TestButton,
    TestButton,
    TestButton,
    TestButton,
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
    {
      type: PresentationalComponentType.UI,
      name: 'Circular Progress Bar',
      id: 'circular-progress-bar',
    },
    { type: PresentationalComponentType.UI, name: 'Circular Image', id: 'circular-image' },
    { type: PresentationalComponentType.UI, name: 'Button', id: 'button' },
  ];
  protected readonly uiItems: MenuItem[] = this.items
    .filter((item) => item.type === PresentationalComponentType.UI)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({ label: item.name, command: () => (this.selectedId = item.id) }));
  protected readonly featureItems = this.items
    .filter((item) => item.type === PresentationalComponentType.Feature)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({ label: item.name, command: () => (this.selectedId = item.id) }));
}
