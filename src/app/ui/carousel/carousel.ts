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
  ChangeDetectionStrategy,
} from '@angular/core';
import { CarouselConfigData, CarouselOutputData } from './carousel.interface';
import { Logger } from '../../utility/logger/logger';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
  protected readonly showOverlay = computed(() => this.config().showOverlay ?? false);
  private requestAnimationRefId: number | null = null;
  protected isImageLoaded = signal(false); // 画像読み込み完了フラグ
  protected loadedImageCount = signal(0); // 新しいシグナル：読み込み済み画像の数

  // DOMエレメント
  @ViewChildren('imgElement') imageElements!: QueryList<ElementRef<HTMLImageElement>>;

  // 依存サービス
  private destroyRef = inject(DestroyRef);
  private logger = inject(Logger);

  // 出力イベント
  @Output() clicked = new EventEmitter<CarouselOutputData>();

  //----------------------------------------------------------------------------
  // ライフサイクル
  //
  ngOnInit(): void {
    this.logger.debug(`${this.className}.ngOnInit()`);
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

    // コンポーネント破棄時にアニメーションフレーム要求をキャンセル
    this.destroyRef.onDestroy(() => {
      if (this.requestAnimationRefId !== null) {
        cancelAnimationFrame(this.requestAnimationRefId);
        this.requestAnimationRefId = null;
      }
    });
  }

  private next() {
    this.isTransitioning = true; // アニメーションを有効にする
    this.currentIndex.update((index) => index + 1);
  }

  //----------------------------------------------------------------------------
  // アニメーション制御
  //
  // 現在のインデックスの画像が「中央」に来るようにtranslateXを計算
  private calcImageOffsetX(currentIndex: number): string {
    const location = `${this.className}.calcImageOffsetX()`;
    // this.logger.debug(`${location} index=${currentIndex}`);

    if (!this.imageElements || this.imageElements.length === 0) {
      this.logger.warn(`${location} imageElements is null`);
      return '0';
    }

    const images = this.imageElements.toArray();
    const targetImg = images[currentIndex]?.nativeElement;

    if (!targetImg) {
      this.logger.error(`${location} targetImg is null`);
      return '0';
    }

    // 最終的なオフセット量はCSS側で計算。
    // 計算に必要な対象画像のオフセットをここで計算。
    const offsetExpr = `${targetImg.offsetLeft + targetImg.offsetWidth / 2}px`;
    // this.logger.debug(`${location} offsetExpr=${offsetExpr}`);
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
      this.logger.debug(`${location} index:${oldIndex} --> ${this.currentIndex()}`);
    }
    // displayImagesの1つ目の画像配列のゾーンに入ったら
    // アニメーションを切って最後の画像にインデックスを戻す。
    else if (this.currentIndex() < count) {
      this.isTransitioning = false;
      this.currentIndex.update((index) => index + count);
      this.logger.debug(`${location} index:${oldIndex} --> ${this.currentIndex()}`);
    }
  }

  /**
   * Angularの変更検知を走らせて transformStyle を再計算
   * 関数呼び出し自体に意味があるので、基本は空関数でもいい。
   * ここではtranslateXのスタイルを再計算している。画像準備完了のタイミングでオフセット初期値を設定するため。
   */
  refresh() {
    const location = `${this.className}.refresh()`;
    this.logger.debug(`${location}`);

    this.loadedImageCount.update((count) => count + 1); // 読み込み済み画像をカウントアップ

    // 全ての画像が読み込まれたら初期オフセットを計算し、カルーセルを表示可能にする
    if (this.loadedImageCount() === this.displayItems().length) {
      this.isImageLoaded.set(true); // 全ての画像が読み込み完了

      // すでに次フレームでリフレッシュ予定の場合は何もしない。
      if (this.requestAnimationRefId !== null) {
        cancelAnimationFrame(this.requestAnimationRefId);
        this.requestAnimationRefId = null;
      }

      // アニメーションフレームを要求してオフセット計算を予約
      this.requestAnimationRefId = requestAnimationFrame(() => {
        this.requestAnimationRefId = null;
        this.imageOffset.set(this.calcImageOffsetX(this.currentIndex()));
        this.logger.info(`${location} All images loaded. Initial offset calculated.`);
      });
    }
  }

  //----------------------------------------------------------------------------
  // ドットクリックイベント
  //
  /**
   * ドットインジケーターがクリックされた場合に表示する画像を変更する。
   * @param index 画面上に表示されているドットのインデックス。
   */
  protected dotClickHandler(index: number) {
    const location = `${this.className}.dotClickHandler()`;
    this.logger.debug(`${location} index=${index}`);

    this.currentIndex.set(index + this.imageNum());
  }

  //----------------------------------------------------------------------------
  // 画像クリックイベント
  //
  protected imageClickHandler(id: string) {
    const location = `${this.className}.imageClickHandler()`;
    this.logger.debug(`${location} id=${id}`);

    this.clicked.emit({ id });
  }
}
