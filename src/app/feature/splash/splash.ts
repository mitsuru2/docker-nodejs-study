import { Component, input } from '@angular/core';
import { SplashConfigData } from './splash.interface';

@Component({
  selector: 'app-splash',
  imports: [],
  templateUrl: './splash.html',
  styleUrl: './splash.scss',
})
export class Splash {
  private readonly className = 'Splash';

  // 入力パラメータ
  config = input.required<SplashConfigData>();
}
