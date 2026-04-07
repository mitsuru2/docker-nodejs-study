import { inject, Injectable } from '@angular/core';
import { Logger } from '../../utility/logger/logger';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleData } from '../../model/db-data';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Database {
  private readonly className = 'Database';
  private readonly env = environment;

  // 依存サービス
  private logger = inject(Logger);
  private http = inject(HttpClient);

  constructor() {
    this.logger.debug(`New ${this.className}()`);
  }

  readData(container: string, partitionKey: string): Observable<ArticleData> {
    const url = `${this.env.apiUrl}/db/${container}/${partitionKey}`;
    return this.http.get<ArticleData>(url);
  }
}
