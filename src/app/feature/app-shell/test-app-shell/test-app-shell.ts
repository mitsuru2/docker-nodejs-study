import { Component, inject } from '@angular/core';
import { AppShell } from '../app-shell';
import { AppShellOutputData } from '../app-shell.interface';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-test-app-shell',
  imports: [AppShell, ToastModule],
  templateUrl: './test-app-shell.html',
  styleUrl: './test-app-shell.scss',
})
export class TestAppShell {
  private readonly className = 'TestAppShell';
  private messageService = inject(MessageService);

  protected readonly testCases: { title: string; id: string }[] = [
    { title: 'DevTool (F12) でレイアウト切替え', id: 'as1' },
  ];

  protected clickHandler(event: AppShellOutputData) {
    this.messageService.add({ severity: 'info', summary: 'info', detail: JSON.stringify(event) });
  }
}
