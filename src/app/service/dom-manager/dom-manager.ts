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

  constructor() {
    Logger.debug(`New ${this.className}()`);
    this.renderer = this.factory.createRenderer(null, null);
  }

  setAttribute(element: HTMLElement, name: string, value: string) {
    Logger.debug(`${this.className}.setAttribute() name=${name}, value=${value}`);
    if (element && name) {
      this.renderer.setAttribute(element, name, value);
    }
  }
}
