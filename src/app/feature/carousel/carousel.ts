import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { CarouselConfigData } from './carousel.interface';
import { Logger } from '../../utility/logger/logger';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements OnInit {
  private readonly className = 'Carousel';

  // 入力パラメータ
  config = input.required<CarouselConfigData>();

  // 制御パラメータ
  protected readonly displayItems = computed(() => {
    // 表示用画像配列。ループに見せかけるために元の配列をコピーして元の配列の3倍の配列を作成。
    // 厳密にするなら3倍にする必要はないが、インデックス計算を簡単にするために3倍にしている。
    const images = this.config().images;
    return [...images, ...images, ...images];
  });
  private readonly intervalTime = computed(() => this.config().interval);
  private currentIndex = signal<number>(0); // ngOnInitで初期化。
  protected transformStyle = linkedSignal({
    source: this.currentIndex,
    computation: (index) => this.updateTransformStyle(index),
  });
  protected isTransitioning = false; // アニメーション中を表すフラグ

  // DOMエレメント
  @ViewChildren('imgElement') imageElements!: QueryList<ElementRef<HTMLImageElement>>;

  // 依存サービス
  private destroyRef = inject(DestroyRef);

  //----------------------------------------------------------------------------
  // ライフサイクル
  //
  ngOnInit(): void {
    Logger.debug(`${this.className}.ngOnInit()`);
    this.currentIndex.set(this.config().images.length);
    this.startAutoPlay();
  }

  private startAutoPlay() {
    // インターバルタイマーでインデックスを更新。
    const timer = setInterval(() => {
      this.next();
    }, this.intervalTime());

    // コンポーネント破棄時にタイマーを停止。
    this.destroyRef.onDestroy(() => {
      clearInterval(timer);
    });
  }

  next() {
    this.isTransitioning = true; // アニメーションを有効にする
    this.currentIndex.update((index) => index + 1);
  }

  //----------------------------------------------------------------------------
  // アニメーション制御
  //
  // 現在のインデックスの画像が「中央」に来るようにtranslateXを計算
  private updateTransformStyle(currentIndex: number) {
    const location = `${this.className}.updateTransformStyle()`;
    Logger.debug(`${location} index=${currentIndex}`);

    if (!this.imageElements) {
      Logger.warn(`transformStyle() imageElements is null`);
      return 'translateX(0)';
    }

    const images = this.imageElements.toArray();
    const targetImg = images[currentIndex]?.nativeElement;
    const viewportWidth = 300; // viewportの幅

    if (!targetImg) {
      Logger.error(`transformStyle() targetImg is null`);
      return 'translateX(0)';
    }

    // 計算式: (画像の位置) - (viewport中央までの余白)
    // これにより、画像サイズがバラバラでも常にその画像が中央に来ます
    const offset = targetImg.offsetLeft - viewportWidth / 2 + targetImg.offsetWidth / 2;
    return `translateX(${-offset}px)`;
  }

  onTransitionEnd() {
    const location = `${this.className}.onTransitionEnd()`;
    const count = this.displayItems().length / 3;
    const oldIndex = this.currentIndex();

    // displayImagesの3つ目の画像配列のゾーンに入ったら
    // アニメーションを切って最初の画像にインデックスを戻す。
    if (this.currentIndex() >= count * 2) {
      this.isTransitioning = false;
      this.currentIndex.update((index) => index - count);
      Logger.debug(`${location} index:${oldIndex} --> ${this.currentIndex()}`);
    }
    // displayImagesの1つ目の画像配列のゾーンに入ったら
    // アニメーションを切って最後の画像にインデックスを戻す。
    else if (this.currentIndex() < count) {
      this.isTransitioning = false;
      this.currentIndex.update((index) => index + count);
      Logger.debug(`${location} index:${oldIndex} --> ${this.currentIndex()}`);
    }
  }

  // 画像の読み込み完了時に座標を再計算させるためのトリガー
  refresh() {
    // Angularの変更検知を走らせて transformStyle を再計算
    // 関数呼び出し自体に意味があるので、基本は空関数でもいい。
    // ここではtranslateXのスタイルを再計算している。画像準備完了のタイミングでオフセット初期値を設定するため。
    this.transformStyle.set(this.updateTransformStyle(this.currentIndex()));
  }
}
