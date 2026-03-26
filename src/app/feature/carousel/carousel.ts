import { Component, computed, input } from '@angular/core';
import { CarouselConfigData } from './carousel.interface';
import { Logger } from '../../utility/logger/logger';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {
  private readonly className = 'Carousel';

  // 入力パラメータ
  config = input.required<CarouselConfigData>();

  // 制御パラメータ
  protected readonly displayItems = computed(() => {
    // 表示用画像配列。最後, 1, 2, 3, ... 最後, 最初, 2という配列。
    const images = this.config().images;
    return [images[images.length - 1], ...images, images[0]];
  });
  protected currentIndex = 1; // config.images[0]
  protected isTransitioning = false; // アニメーション中を表すフラグ

  //----------------------------------------------------------------------------
  // アニメーション制御
  //
  move(index: number) {
    const location = `${this.className}.move()`;
    Logger.debug(`${location} index=${index}`);

    // 二重アニメーションガード
    if (this.isTransitioning) {
      Logger.warn(`${location} It's already transitioning. Cancel move().`);
      return;
    }

    // アニメーションフラグのセット
    this.isTransitioning = true;

    // 現在インデックスの更新
    this.currentIndex = index;
  }

  onTransitionEnd() {
    // アニメーションフラグのクリア
    this.isTransitioning = false;

    // 最後のコピー（最初と同じ絵）に到達したら、瞬時に本物の最初へ移動
    if (this.currentIndex === this.displayItems.length - 1) {
      this.currentIndex = 0;
    }
    // 最初のコピー（最後と同じ絵）に到達したら、瞬時に本物の最後へ移動
    if (this.currentIndex === 0) {
      this.currentIndex = this.displayItems.length - 2;
    }
  }
}
