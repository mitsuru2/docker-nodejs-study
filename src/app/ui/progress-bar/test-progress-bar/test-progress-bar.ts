import { Component, OnDestroy, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ProgressBarConfigData } from '../progress-bar.interface';
import { ProgressBar } from '../progress-bar';

@Component({
  selector: 'app-test-progress-bar',
  imports: [ProgressBar],
  templateUrl: './test-progress-bar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './test-progress-bar.scss',
})
export class TestProgressBar implements OnInit, OnDestroy {
  private readonly className = 'TestProgressBar';

  protected readonly testCases: { title: string; config: ProgressBarConfigData }[] = [
    {
      title: '基本形',
      config: { id: 'pb1' },
    },
    {
      title: 'ラベルあり',
      config: { id: 'pb2', showValue: true },
    },
    {
      title: '太さ変更 (CSS)',
      config: { id: 'pb3' },
    },
    {
      title: '色変更 (CSS)',
      config: { id: 'pb4' },
    },
  ];

  // 進捗制御
  protected progress = signal<number>(0);
  private timer?: NodeJS.Timeout;

  ngOnInit(): void {
    const location = `${this.className}.ngOnInit()`;
    console.log(`${location}`);

    this.timer = setInterval(() => {
      this.progress.update((progress) => {
        let next = progress + 20;
        if (next > 100) {
          next = 0;
        }
        // console.log(`${this.className}.setInterval() progress=${next}`);
        return next;
      });
    }, 1500);
  }

  ngOnDestroy(): void {
    const location = `${this.className}.ngOnDestroy()`;
    console.log(`${location}`);
    clearInterval(this.timer);
  }
}
