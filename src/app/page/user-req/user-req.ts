import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArticleData } from '../../model/db-data';
import { AppShell } from '../../feature/app-shell/app-shell';
import { Article } from '../../feature/article/article';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-req',
  imports: [AppShell, Article],
  templateUrl: './user-req.html',
  styleUrl: './user-req.scss',
})
export class UserReq {
  private readonly className = 'UserReq';

  // 依存サービス
  private http = inject(HttpClient);

  // 表示データ
  private readonly jsonPath = 'data/articles-user-req.json';
  protected article = toSignal(
    this.http.get<ArticleData[]>(this.jsonPath).pipe(map((res) => res[0])),
    { initialValue: undefined },
  );
}
