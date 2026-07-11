import { Component, OnDestroy, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CircularProgressBarConfigData } from '../circular-progress-bar.interface';
import { CircularProgressBar } from '../circular-progress-bar';

@Component({
  selector: 'app-test-circular-progress-bar',
  imports: [CircularProgressBar],
  templateUrl: './test-circular-progress-bar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './test-circular-progress-bar.scss',
})
export class TestCircularProgressBar implements OnInit, OnDestroy {
  private readonly className = 'TestCircularProgressBar';

  private readonly hamster = 'images/hamster_1x1.webp';
  private readonly size = 320;

  protected readonly testCases: { title: string; config: CircularProgressBarConfigData }[] = [
    {
      title: '基本形',
      config: {
        id: 'cpb1',
        path: this.hamster,
        size: this.size,
      },
    },
    {
      title: '単色',
      config: {
        id: 'cpb2',
        path: this.hamster,
        size: this.size,
      },
    },
    {
      title: '画像無し',
      config: {
        id: 'cpb3',
        size: this.size,
      },
    },
    {
      title: 'ストローク太さ変更',
      config: {
        id: 'cpb4',
        path: this.hamster,
        size: this.size,
        strokeWidth: 4,
      },
    },
  ];

  // 進捗率自動更新
  protected progress = signal(0);
  private timer?: NodeJS.Timeout;

  ngOnInit(): void {
    console.log(`${this.className}.ngOnInit()`);
    this.timer = setInterval(() => {
      this.progress.update((p) => {
        let next = p + 20;
        if (next > 100) {
          next = 0;
        }
        console.log(`${this.className}.setInterval() progress=${next}`);
        return next;
      });
    }, 2000);
  }
  ngOnDestroy(): void {
    console.log(`${this.className}.ngOnInit()`);
    clearInterval(this.timer);
  }
}
