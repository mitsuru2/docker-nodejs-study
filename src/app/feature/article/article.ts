import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ArticleData } from '../../model/db-data';
import { LocalizePipe } from '../../pipe/localize/localize-pipe';
import { ImageModule } from 'primeng/image';
import { DesignTokens } from '../../../styles';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-article',
  imports: [LocalizePipe, ImageModule],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article implements OnInit {
  private readonly className = 'Article';

  // 入力パラメータ
  articles = input.required<ArticleData[]>();
  protected displayArticles = computed(() => {
    return [...this.articles()].sort(
      (a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity),
    );
  });

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
}
