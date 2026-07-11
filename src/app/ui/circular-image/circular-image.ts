import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { CircularImageConfigData } from './circular-image.interface';

@Component({
  selector: 'app-circular-image',
  imports: [],
  templateUrl: './circular-image.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './circular-image.scss',
})
export class CircularImage {
  private readonly className = 'CircularImage';

  // 入力パラメータ
  config = input.required<CircularImageConfigData>();

  // 画像制御
  protected readonly id = computed(() => this.config().id);
  protected readonly path = computed(() => this.config().path!);
  protected readonly alt = computed(() => this.config().alt ?? 'image');
}
