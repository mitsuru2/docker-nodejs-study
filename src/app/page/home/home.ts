import { Component, inject, OnInit } from '@angular/core';
import { AppManager } from '../../service/app-manager/app-manager';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly className = 'Home';

  private app = inject(AppManager);
  private router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 5000);
  }
}
