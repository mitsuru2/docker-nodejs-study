import { Component, inject } from '@angular/core';
import { CardWithButtonConfigData, CardWithButtonOutputData } from '../card-with-button.interface';
import { CardWithButton } from '../card-with-button';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-test-card-with-button',
  imports: [CardWithButton, ToastModule],
  templateUrl: './test-card-with-button.html',
  styleUrl: './test-card-with-button.scss',
})
export class TestCardWithButton {
  private readonly className = 'TestCardWithButton';

  private messageService = inject(MessageService);

  protected readonly dummyContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  protected readonly testCases: { id: string; title: string; config: CardWithButtonConfigData }[] =
    [
      {
        id: 't1',
        title: '基本形',
        config: {
          button: {
            id: 'b1',
            label: 'Detail',
            icon: 'pi pi-search',
          },
        },
      },
      {
        id: 't2',
        title: 'タイトルあり',
        config: {
          title: 'Section Title',
          button: {
            id: 'b2',
            label: 'Detail',
          },
        },
      },
      {
        id: 't3',
        title: 'アイコンのみボタン, width: 500px',
        config: {
          button: {
            id: 'b3',
            icon: PrimeIcons.ADDRESS_BOOK,
          },
        },
      },
      {
        id: 't4',
        title: 'ボタンseverity変更, メッセージあまり時の動作',
        config: {
          button: {
            id: 'b4',
            label: 'Submit',
            icon: PrimeIcons.ANDROID,
            severity: 'secondary',
          },
        },
      },
    ];

  protected clickedHandler(event: CardWithButtonOutputData) {
    this.messageService.add({ severity: 'info', summary: 'info', detail: JSON.stringify(event) });
  }
}
