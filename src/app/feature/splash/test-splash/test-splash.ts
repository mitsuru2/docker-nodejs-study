import { AfterViewInit, Component, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { Splash } from '../splash';
import { sleep } from '../../../utility/sleep/sleep';

@Component({
  selector: 'app-test-splash',
  imports: [Splash],
  templateUrl: './test-splash.html',
  styleUrl: './test-splash.scss',
})
export class TestSplash implements OnInit, OnDestroy {
  private readonly className = 'TestSplash';

  protected readonly testCases: { title: string; id: string }[] = [
    { title: '基本形', id: 'sp1' },
    { title: 'サイズ調整 (width)', id: 'sp2' },
  ];

  // 進捗率
  protected progress = signal(0);
  private readonly steps = [0, 10, 100];
  private readonly interval = 1500;
  private index = 0;
  private timer?: NodeJS.Timeout;

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.progress.set(this.steps[this.index]);
      this.index = (this.index + 1) % this.steps.length;
    }, this.interval);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
