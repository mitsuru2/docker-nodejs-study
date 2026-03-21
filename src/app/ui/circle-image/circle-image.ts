import { Component, computed, input } from '@angular/core';
import { CircleImageConfigData } from './circle-image.interface';

@Component({
  selector: 'app-circle-image',
  imports: [],
  templateUrl: './circle-image.html',
  styleUrl: './circle-image.scss',
})
export class CircleImage {
  private readonly className = 'CircleImage';

  // 入力パラメータ
  config = input.required<CircleImageConfigData>();

  // 画像制御
  protected readonly path = computed(() => this.config().path!);
  protected readonly width = computed(() => this.config().width ?? 'auto');
  protected readonly height = computed(() => this.config().height ?? 'auto');
  protected readonly alt = computed(() => this.config().alt ?? 'image');
}
