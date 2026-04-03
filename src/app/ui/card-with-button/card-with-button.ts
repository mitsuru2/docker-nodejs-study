import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { CardWithButtonConfigData, CardWithButtonOutputData } from './card-with-button.interface';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-card-with-button',
  imports: [CardModule, ButtonModule, ToastModule],
  templateUrl: './card-with-button.html',
  styleUrl: './card-with-button.scss',
})
export class CardWithButton {
  private readonly className = 'CardWithButton';

  // 入力パラメータ
  config = input.required<CardWithButtonConfigData>();

  // 出力イベント
  @Output() clicked = new EventEmitter<CardWithButtonOutputData>();

  // 制御パラメータ
  protected title = computed(() => this.config().title ?? '');
  protected buttonId = computed(() => this.config().button.id);
  protected buttonLabel = computed(() => this.config().button.label ?? '');
  protected buttonIcon = computed(() => this.config().button.icon ?? '');
  protected buttonSeverity = computed(() => this.config().button.severity ?? null);
  protected buttonRounded = computed(() => (this.buttonLabel().length > 0 ? false : true));

  protected clickedHandler(id: string) {
    this.clicked.emit({ id });
  }
}
