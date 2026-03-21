import { Component, computed, input } from '@angular/core';
import { ProgressBarConfigData } from './progress-bar.interface';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  private readonly className = 'ProgressBar';

  // 入力パラメータ
  config = input.required<ProgressBarConfigData>();
  progress = input.required<number>(); // 進捗率 (0~100)

  // 制御パラメータ
  protected readonly id = computed(() => this.config().id);
  protected readonly strokeWidth = computed(() => this.config().strokeWidth);
  protected readonly fontSize = computed(() => this.config().fontSize);
  protected readonly gradientStops = computed(() => {
    const config = this.config();
    if (config.gradientStops) {
      return config.gradientStops;
    } else if (config.strokeColor) {
      return [
        { offset: 0, color: config.strokeColor },
        { offset: 100, color: config.strokeColor },
      ];
    } else {
      return [
        { offset: 0, color: 'black' },
        { offset: 100, color: 'black' },
      ];
    }
  });
}
