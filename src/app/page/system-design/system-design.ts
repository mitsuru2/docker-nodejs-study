import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArticleData } from '../../model/db-data';
import { map } from 'rxjs';
import { AppShell } from '../../feature/app-shell/app-shell';
import { Article } from '../../feature/article/article';

@Component({
  selector: 'app-system-design',
  imports: [AppShell, Article],
  templateUrl: './system-design.html',
  styleUrl: './system-design.scss',
})
export class SystemDesign {
  private readonly className = 'SystemDesign';

  // 依存サービス
  private http = inject(HttpClient);

  // 表示データ
  private readonly jsonPath = 'data/articles-system-design.json';
  protected article = toSignal(
    this.http.get<ArticleData[]>(this.jsonPath).pipe(map((res) => res[0])),
    { initialValue: undefined },
  );
}
