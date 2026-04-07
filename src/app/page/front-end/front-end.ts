import { Component, inject } from '@angular/core';
import { Logger } from '../../utility/logger/logger';
import { AppShell } from '../../feature/app-shell/app-shell';
import { ArticleData } from '../../model/db-data';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatabaseManager } from '../../service/database-manager/database-manager';

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
  private db = inject(DatabaseManager);

  // 表示データ
  protected articles = toSignal(this.db.getData<ArticleData[]>('articles', 'front-end'));
}
