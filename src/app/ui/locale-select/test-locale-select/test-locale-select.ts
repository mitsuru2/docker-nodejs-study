import { Component, inject, signal, WritableSignal } from '@angular/core';
import { LocaleSelectConfigData } from '../locale-select.interface';
import { LocaleSelect } from '../locale-select';
import { appLocales, LocaleData } from '../../../model/locale';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, merge } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-test-locale-select',
  imports: [LocaleSelect, ToastModule],
  templateUrl: './test-locale-select.html',
  styleUrl: './test-locale-select.scss',
})
export class TestLocaleSelect {
  private readonly className = 'TestLocaleSelect';
  private messageService = inject(MessageService);

  protected readonly testCases: {
    id: string;
    title: string;
    config: LocaleSelectConfigData;
    value: WritableSignal<LocaleData>;
  }[] = [
    {
      id: 't1',
      title: '国選択, 初期値日本',
      config: { type: 'country' },
      value: signal(appLocales.jaJP),
    },
    {
      id: 't2',
      title: '言語選択, 初期値英語',
      config: { type: 'language' },
      value: signal(appLocales.enGB),
    },
    {
      id: 't3',
      title: '外観調整1',
      config: { type: 'language' },
      value: signal(appLocales.jaJP),
    },
    {
      id: 't4',
      title: '外観調整2',
      config: { type: 'language' },
      value: signal(appLocales.jaJP),
    },
  ];

  constructor() {
    // 各シグナルをObservableに変換して合成する
    const changes$ = this.testCases.map((test, index) =>
      toObservable(test.value).pipe(map((value) => ({ index, value }))),
    );

    merge(...changes$).subscribe(({ index, value }) => {
      const message = `index=${index}, locale=${value.locale}`;
      this.messageService.add({ severity: 'info', summary: 'info', detail: message });
    });
  }
}
