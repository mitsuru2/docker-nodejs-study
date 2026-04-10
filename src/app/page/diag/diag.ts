import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArticleData } from '../../model/db-data';
import { map } from 'rxjs';
import { AppShell } from '../../feature/app-shell/app-shell';
import { Article } from '../../feature/article/article';

@Component({
  selector: 'app-diag',
  imports: [AppShell, Article],
  templateUrl: './diag.html',
  styleUrl: './diag.scss',
})
export class Diag {
  private readonly className = 'Diag';

  // 依存サービス
  private http = inject(HttpClient);

  // 表示データ
  private readonly jsonPath = '/data/articles-diag.json';
  protected article = toSignal(
    this.http.get<ArticleData[]>(this.jsonPath).pipe(map((res) => res[0])),
    { initialValue: undefined },
  );
}
