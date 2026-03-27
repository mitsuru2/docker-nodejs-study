import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  input,
  linkedSignal,
  OnInit,
  Output,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { CarouselConfigData, CarouselOutputData } from './carousel.interface';
import { Logger } from '../../utility/logger/logger';
import { DesignTokens } from '../../../styles';

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
  private readonly intervalTime = computed(() => this.config().interval); // 画像送りインターバル時間
  protected currentIndex = signal<number>(0); // ngOnInitで初期化。
  protected imageOffset = linkedSignal({
    // trackのオフセット量計算に使用する対象画像中央までのオフセット
    source: this.currentIndex,
    computation: (index) => this.calcImageOffsetX(index),
  });
  protected isTransitioning = false; // アニメーション中を表すフラグ
  protected readonly showDots = computed(() => this.config().showDots ?? false);
  protected readonly imageNum = computed(() => this.config().images.length);
  protected readonly showOverlay = computed(() => this.config().showOvelay ?? false);

  // DOMエレメント
  @ViewChildren('imgElement') imageElements!: QueryList<ElementRef<HTMLImageElement>>;

  // 依存サービス
  private destroyRef = inject(DestroyRef);

  // 出力イベント
  @Output() clicked = new EventEmitter<CarouselOutputData>();

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
  private calcImageOffsetX(currentIndex: number): string {
    const location = `${this.className}.calcImageOffsetX()`;
    Logger.debug(`${location} index=${currentIndex}`);

    if (!this.imageElements) {
      Logger.warn(`transformStyle() imageElements is null`);
      return '0';
    }

    const images = this.imageElements.toArray();
    const targetImg = images[currentIndex]?.nativeElement;

    if (!targetImg) {
      Logger.error(`transformStyle() targetImg is null`);
      return '0';
    }

    // 最終的なオフセット量はCSS側で計算。
    // 計算に必要な対象画像のオフセットをここで計算。
    const offsetExpr = `${targetImg.offsetLeft + targetImg.offsetWidth / 2}px`;
    Logger.debug(`${location} offsetExpr=${offsetExpr}`);
    return offsetExpr;
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
    this.imageOffset.set(this.calcImageOffsetX(this.currentIndex()));
  }

  //----------------------------------------------------------------------------
  // ドットクリックイベント
  //
  protected dotClickHandler(index: number) {
    const location = `${this.className}.dotClickHandler()`;
    Logger.debug(`${location} index=${index}`);

    this.currentIndex.set(index);
  }

  //----------------------------------------------------------------------------
  // 画像クリックイベント
  //
  protected imageClickHandler(id: string) {
    const location = `${this.className}.imageClickHandler()`;
    Logger.debug(`${location} id=${id}`);

    this.clicked.emit({ id });
  }
}
