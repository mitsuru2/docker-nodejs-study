import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Logger } from '../../utility/logger/logger';

@Injectable({
  providedIn: 'root',
})
export class DomManager {
  private readonly className = 'DomManager';

  // 依存サービス
  private renderer: Renderer2;
  private factory = inject(RendererFactory2);
  private logger = inject(Logger);

  constructor() {
    this.logger.debug(`New ${this.className}()`);
    this.renderer = this.factory.createRenderer(null, null);
  }

  setAttribute(element: HTMLElement, name: string, value: string) {
    this.logger.debug(`${this.className}.setAttribute() name=${name}, value=${value}`);
    if (element && name) {
      this.renderer.setAttribute(element, name, value);
    }
  }
}
