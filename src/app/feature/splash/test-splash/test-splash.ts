import { Component } from '@angular/core';
import { SplashConfigData } from '../splash.interface';
import { Splash } from '../splash';

@Component({
  selector: 'app-test-splash',
  imports: [Splash],
  templateUrl: './test-splash.html',
  styleUrl: './test-splash.scss',
})
export class TestSplash {
  private readonly className = 'TestSplash';

  protected readonly testCases: { title: string; config: SplashConfigData }[] = [
    { title: '基本形', config: {} }
  ];
}
