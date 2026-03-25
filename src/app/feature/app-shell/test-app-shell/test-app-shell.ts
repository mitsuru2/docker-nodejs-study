import { Component } from '@angular/core';
import { AppShellConfigData } from '../app-shell.interface';
import { AppShell } from '../app-shell';

@Component({
  selector: 'app-test-app-shell',
  imports: [AppShell],
  templateUrl: './test-app-shell.html',
  styleUrl: './test-app-shell.scss',
})
export class TestAppShell {
  private readonly className = 'TestAppShell';

  protected readonly testCases: { title: string; config: AppShellConfigData }[] = [
    { title: '基本形', config: {} }
  ];
}
