import { Component, input } from '@angular/core';
import { AppShellConfigData } from './app-shell.interface';

@Component({
  selector: 'app-app-shell',
  imports: [],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly className = 'AppShell';

  // 入力パラメータ
  config = input.required<AppShellConfigData>();
}
