import {
  AfterViewInit,
  Component,
  DestroyRef,
  NgZone,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { ProgressBarConfigData } from './progress-bar.interface';
import { Logger } from '../../utility/logger/logger';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
  host: {
    role: 'progressbar',
    '[attr.aria-valuenow]': 'progress()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
  },
})
export class ProgressBar implements AfterViewInit {
  private readonly className = 'ProgressBar';

  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  // 入力パラメータ
  config = input.required<ProgressBarConfigData>();
  progress = input.required<number>(); // 進捗率 (0~100)

  // 制御パラメータ
  protected readonly id = computed(() => this.config().id);
  protected readonly showValue = computed(() => this.config().showValue ?? false);

  // アニメーション
  private isInit = false;
  private currentValue = 0;
  private targetValue = 0;
  private animationFrameId: number | null = null;

  // HTML参照
  @ViewChild('container') containerRef!: ElementRef;
  @ViewChild('label') labelRef!: ElementRef;

  // 依存サービス
  private logger = inject(Logger);

  //----------------------------------------------------------------------------
  // 生成・消滅
  //
  constructor() {
    // コンポーネント破棄時にアニメーションを確実に停止する
    this.destroyRef.onDestroy(() => {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
      }
    });

    effect(() => {
      this.targetValue = this.progress();
      if (!this.isInit) {
        this.currentValue = this.targetValue;
        this.isInit = true;
      } else {
        this.animateProgress(this.currentValue, this.targetValue, 1000);
      }
    });
  }

  ngAfterViewInit(): void {
    this.logger.debug(`${this.className}.ngAfterViewInit()`);
    this.updateDom(this.currentValue);
  }

  //----------------------------------------------------------------------------
  // アニメーション制御関数
  //
  /**
   * 進捗が更新された場合のアニメーションを制御する。
   * @param startValue 遷移前の値
   * @param endValue 遷移後の値
   * @param duration アニメーション時間
   */
  private animateProgress(startValue: number, endValue: number, duration: number) {
    // 同じならアニメーションしない
    if (startValue === endValue) {
      return;
    }

    // 実行中のアニメーションをキャンセル
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // アニメーション完了時間に対する割合

      // イージング関数（ease-in-outのような動きを作る場合）
      // t: 0.0 - 1.0
      const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

      // 現在の値を計算して画面更新
      const easedProgress = ease(progress);
      this.currentValue = startValue + (endValue - startValue) * easedProgress;
      this.updateDom(this.currentValue);

      // 次回アニメーションフレームの要求
      // 目標値まで到達してたら終了
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(update);
      } else {
        this.animationFrameId = null;
      }
    };

    // Angularの変更検知をトリガーしないようZone外で実行
    this.ngZone.runOutsideAngular(() => {
      this.animationFrameId = requestAnimationFrame(update);
    });
  }

  private updateDom(value: number) {
    // 1. CSS変数を更新（これで位置が動く）
    const containerElement = this.containerRef.nativeElement;
    if (containerElement) {
      containerElement.style.setProperty('--progress-value', `${value}`);
    }

    // 2. ラベルテキストを更新（数値を丸めて表示）
    if (this.showValue()) {
      const labelElement = this.labelRef.nativeElement;
      if (labelElement) {
        labelElement.textContent = Math.round(value) + '%';
      }
    }
  }
}
