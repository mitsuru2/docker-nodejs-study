import { Injectable } from '@angular/core';
import { Logger } from '../../utility/logger/logger';

@Injectable({
  providedIn: 'root',
})
export class AppManager {
  private readonly className = 'AppManager';

  constructor() {
    Logger.debug(`New ${this.className}()`);
  }
}
