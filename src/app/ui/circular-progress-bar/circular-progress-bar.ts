import { Component, computed, input, Signal } from '@angular/core';
import { CircularProgressBarConfigData } from './circular-progress-bar.interface';
import { CircularImage } from '../circular-image/circular-image';
import { CircularImageConfigData } from '../circular-image/circular-image.interface';
import { GradientStopData } from '../../model/gradient-stop';

@Component({
  selector: 'app-circular-progress-bar',
  imports: [CircularImage],
  templateUrl: './circular-progress-bar.html',
  styleUrl: './circular-progress-bar.scss',
})
export class CircularProgressBar {
  private readonly className = 'CircularProgressBar';

  // 入力パラメータ
  config = input.required<CircularProgressBarConfigData>();
  progress = input.required<number>(); // 進捗率 (0~100) 。動的データなのでconfigから除外。

  // 制御パラメータ
  protected readonly id = computed(() => this.config().id);
  protected readonly viewBox = computed(() => `0 0 ${this.config().size} ${this.config().size}`);
  protected readonly size = computed(() => this.config().size);
  protected readonly strokeWidth = computed(() => this.config().strokeWidth);
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
  protected readonly center = computed(() => this.size() / 2); // 中心座標
  protected readonly radius = computed(() => (this.size() - this.strokeWidth()) / 2); // 半径
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius()); // 円周
  // 描画しない円周の長さ
  protected readonly offset = computed(() => {
    const progressOffset = (100 - this.progress()) / 100;
    return this.circumference() * progressOffset;
  });
  // 円周グラデーション用のCSSスタイル (conic-gradient) を生成
  protected readonly conicGradient = computed(() => {
    const stops = this.gradientStops()
      .map((stop) => `${stop.color} ${stop.offset}%`)
      .join(', ');
    return `conic-gradient(from 0deg, ${stops})`;
  });
  // 画像コンフィグ
  protected readonly imageConfig: Signal<CircularImageConfigData> = computed(() => ({
    path: this.config().path,
    width: `${this.size() - this.strokeWidth() * 2 + 2}px`,
    height: `${this.size() - this.strokeWidth() * 2 + 2}px`,
  }));
}
