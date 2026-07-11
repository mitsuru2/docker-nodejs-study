import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AppShell } from '../../feature/app-shell/app-shell';
import { ArticleData } from '../../model/db-data';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { ImageModule } from 'primeng/image';
import { Article } from '../../feature/article/article';
import { map } from 'rxjs';

@Component({
  selector: 'app-front-end',
  imports: [AppShell, ImageModule, Article],
  templateUrl: './front-end.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './front-end.scss',
})
export class FrontEnd {
  private readonly className = 'FrontEnd';

  // 依存サービス
  private http = inject(HttpClient);

  // 表示データ
  private readonly jsonPath = 'data/articles-front-end.json';
  protected article = toSignal(
    this.http.get<ArticleData[]>(this.jsonPath).pipe(map((res) => res[0])),
    { initialValue: undefined },
  );
}
