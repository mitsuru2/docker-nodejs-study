import { inject, Injectable } from '@angular/core';
import { Logger } from '../../utility/logger/logger';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleData } from '../../model/db-data';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseManager {
  private readonly className = 'DatabaseManager';
  private readonly env = environment;

  // 依存サービス
  private logger = inject(Logger);
  private http = inject(HttpClient);

  constructor() {
    this.logger.debug(`New ${this.className}()`);
  }

  getData<T>(container: string, partitionKey: string): Observable<T> {
    const location = `${this.className}.getData()`;
    const url = `${this.env.apiUrl}/db/${container}/${partitionKey}`;
    this.logger.info(`${location} url=${url}`);
    return this.http.get<T>(url);
  }
}
