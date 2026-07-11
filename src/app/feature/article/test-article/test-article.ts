import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Article } from '../article';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArticleData } from '../../../model/db-data';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-test-article',
  imports: [Article, ButtonModule],
  templateUrl: './test-article.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './test-article.scss',
})
export class TestArticle {
  private readonly className = 'TestArticle';

  // 制御パラメータ
  protected inputUndefined = signal<boolean>(false);

  // 依存サービス
  private http = inject(HttpClient);

  // 表示データ
  private readonly jsonPath = '/data/articles-front-end.json';
  protected articles = toSignal(this.http.get<ArticleData[]>(this.jsonPath), { initialValue: [] });

  protected buttonClickedHandler() {
    this.inputUndefined.update((value) => !value);
  }
}
