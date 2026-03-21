import { Component, input, computed, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonConfigData, ButtonOutputData } from './button.interface';

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  private readonly className = 'Button';

  // 入力パラメータ
  config = input.required<ButtonConfigData>();

  // ボタンプロパティ
  protected readonly id = computed(() => this.config().id);
  protected label = computed(() => this.config().label);
  protected icon = computed(() => this.config().icon);
  protected round = computed(() => this.config().round);
  protected outline = computed(() => this.config().outline);
  protected width = computed(() => this.config().width);
  protected severity = computed(() => this.config().severity);

  // 出力イベント
  @Output() clicked = new EventEmitter<ButtonOutputData>();

  protected onClickHandler() {
    this.clicked.emit({ id: this.id() });
  }
}
