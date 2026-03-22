import { Component, computed, input } from '@angular/core';
import { ProgressBarConfigData } from './progress-bar.interface';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-progress-bar',
  imports: [ProgressBarModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
  host: {
    '[style.--progress-value]': 'progress()',
  },
})
export class ProgressBar {
  private readonly className = 'ProgressBar';

  // 入力パラメータ
  config = input.required<ProgressBarConfigData>();
  progress = input.required<number>(); // 進捗率 (0~100)

  // 制御パラメータ
  protected readonly id = computed(() => this.config().id);
  protected readonly showValue = computed(() => this.config().showValue ?? false);
  protected readonly strokeWidth = computed(() => this.config().strokeWidth ?? 2); // Default 2px.
  protected readonly valueText = computed(() => `${Math.floor(this.progress())}%`);
}
