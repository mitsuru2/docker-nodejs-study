import { Component, OnDestroy, OnInit, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CircularProgressBarConfigData } from '../circular-progress-bar.interface';
import { CircularProgressBar } from '../circular-progress-bar';

@Component({
  selector: 'app-test-circular-progress-bar',
  imports: [CircularProgressBar],
  templateUrl: './test-circular-progress-bar.html',
  styleUrl: './test-circular-progress-bar.scss',
})
export class TestCircularProgressBar implements OnInit, OnDestroy {
  private readonly className = 'TestCircularProgressBar';
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly hamster = 'images/hamster_1x1.png';

  protected readonly config: CircularProgressBarConfigData = {
    id: 'cp1',
    path: this.hamster,
    size: 200,
    strokeWidth: 10,
    gradientStops: [
      { offset: 0, color: 'blue' },
      { offset: 100, color: 'red' },
    ],
  };

  // 進捗率自動更新
  protected progress = signal(0);
  private timer?: NodeJS.Timeout;

  ngOnInit(): void {
    console.log(`${this.className}.ngOnInit()`);
    this.timer = setInterval(() => {
      this.progress.update((p) => {
        let next = p + 10;
        if (next > 100) {
          next = 0;
        }
        console.log(`progress=${next}`);
        return next;
      });
    }, 2000);
  }
  ngOnDestroy(): void {
    console.log(`${this.className}.ngOnInit()`);
    clearInterval(this.timer);
  }
}
