import { Component } from '@angular/core';
import { ButtonConfigData } from '../button.interface';
import { PrimeIcons } from 'primeng/api';
import { Button } from '../button';

@Component({
  selector: 'app-test-button',
  imports: [Button],
  templateUrl: './test-button.html',
  styleUrl: './test-button.scss',
})
export class TestButton {
  config: ButtonConfigData = {
    id: 'button',
    label: 'Check',
    icon: PrimeIcons.CHECK,
  };
}
