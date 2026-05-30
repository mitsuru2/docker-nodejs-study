import { Component, input } from '@angular/core';
import { CircularImage } from '../../ui/circular-image/circular-image';
import { CircularImageConfigData } from '../../ui/circular-image/circular-image.interface';
import { ProgressBar } from '../../ui/progress-bar/progress-bar';
import { ProgressBarConfigData } from '../../ui/progress-bar/progress-bar.interface';

@Component({
  selector: 'app-splash',
  imports: [CircularImage, ProgressBar],
  templateUrl: './splash.html',
  styleUrl: './splash.scss',
})
export class Splash {
  private readonly className = 'Splash';

  // 入力パラメータ
  progress = input.required<number>();

  // 制御パラメータ
  protected readonly imagePath = 'images/hamster_1x1.webp';
  protected readonly imageConfig: CircularImageConfigData = {
    id: 'splash-img',
    path: this.imagePath,
  };
  protected readonly progressBarConfig: ProgressBarConfigData = {
    id: 'splash-pb',
    showValue: true,
  };
}
