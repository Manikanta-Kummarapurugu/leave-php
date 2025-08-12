
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div *ngIf="!isLoginPage()">
      <app-navbar></app-navbar>
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-2 p-0">
            <app-sidebar></app-sidebar>
          </div>
          <div class="col-md-10">
            <div class="container-fluid p-4">
              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="isLoginPage()">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated() && !this.isLoginPage()) {
      this.router.navigate(['/login']);
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }
}
