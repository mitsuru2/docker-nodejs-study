import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PresentationalComponentType, UiCatalogItemData } from './ui-catalog.interface';
import { TestCircleImage } from '../../ui/circle-image/test-circle-image/test-circle-image';
import { TestButton } from '../../ui/button/test-button/test-button';

@Component({
  selector: 'app-root', // index.htmlを共通としているためセレクタを修正。
  imports: [
    TestCircleImage,
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
    { type: PresentationalComponentType.UI, name: 'Circle Image', id: 'circle-image' },
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
