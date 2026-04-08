import { Component, inject } from '@angular/core';
import { Logger } from '../../utility/logger/logger';
import { AppShell } from '../../feature/app-shell/app-shell';
import { ArticleData } from '../../model/db-data';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-front-end',
  imports: [AppShell],
  templateUrl: './front-end.html',
  styleUrl: './front-end.scss',
})
export class FrontEnd {
  private readonly className = 'FrontEnd';

  // 依存サービス
  private logger = inject(Logger);
  private http = inject(HttpClient);

  // 表示データ
  private readonly jsonPath = '/data/articles-front-end.json';
  protected articles = toSignal(this.http.get<ArticleData[]>(this.jsonPath), { initialValue: [] });
}
