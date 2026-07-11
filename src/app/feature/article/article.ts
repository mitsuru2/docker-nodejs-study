import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ArticleData, MessageData } from '../../model/db-data';
import { LocalizePipe } from '../../pipe/localize/localize-pipe';
import { ImageModule } from 'primeng/image';
import { DesignTokens } from '../../../styles';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkeletonModule } from 'primeng/skeleton';
import { GalleryModule } from 'primeng/gallery';

@Component({
  selector: 'app-article',
  imports: [LocalizePipe, ImageModule, SkeletonModule, GalleryModule],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article implements OnInit {
  private readonly className = 'Article';

  // 入力パラメータ
  article = input.required<ArticleData | undefined>();

  // 依存サービス
  private bpObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  // スタイル設定変数
  protected thumbHeight = computed(() =>
    this.isMobile() ? undefined : DesignTokens.semantic.custom.article.image.height,
  );
  protected thumbWidth = computed(() =>
    this.isMobile() ? DesignTokens.semantic.custom.article.image.width : undefined,
  );

  // レイアウト制御
  protected isMobile = signal(false);

  ngOnInit(): void {
    // ブレークポイント監視 --> isMobileシグナルに反映
    this.bpObserver
      .observe([`(max-width: ${DesignTokens.primitive.custom.bp.mobile})`])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.isMobile.set(state.matches);
      });
  }

  // 画像ダイアログ
  protected pictureDialogVisible = false;
  protected clickedPicturePath = '';
  protected clickedPictureCaption: MessageData | undefined;
  protected clickedPictureAlt: MessageData | undefined;
  protected showPictureDialog(path: string, caption?: MessageData, alt?: MessageData) {
    this.pictureDialogVisible = true;
    this.clickedPicturePath = path;
    this.clickedPictureCaption = caption;
    this.clickedPictureAlt = alt;
  }
  protected hidePictureDialog() {
    this.pictureDialogVisible = false;
  }
  protected onPictureDialogBgClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.hidePictureDialog();
    }
  }
}
