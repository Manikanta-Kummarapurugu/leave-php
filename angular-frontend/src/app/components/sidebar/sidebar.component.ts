
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="list-group list-group-flush">
        <a routerLink="/dashboard" class="list-group-item list-group-item-action bg-transparent text-white">
          <i class="fas fa-tachometer-alt me-2"></i>Dashboard
        </a>
        
        <div *ngIf="currentUser?.EMPPOSITION === 'Normal user'">
          <a routerLink="/leaves" class="list-group-item list-group-item-action bg-transparent text-white">
            <i class="fas fa-calendar-alt me-2"></i>My Leaves
          </a>
          <a routerLink="/leaves/add" class="list-group-item list-group-item-action bg-transparent text-white">
            <i class="fas fa-plus me-2"></i>Apply Leave
          </a>
        </div>

        <div *ngIf="currentUser?.EMPPOSITION === 'Administrator' || 
                    currentUser?.EMPPOSITION === 'Manager user' || 
                    currentUser?.EMPPOSITION === 'Supervisor user'">
          <a routerLink="/employees" class="list-group-item list-group-item-action bg-transparent text-white">
            <i class="fas fa-users me-2"></i>Employees
          </a>
          <a routerLink="/leaves" class="list-group-item list-group-item-action bg-transparent text-white">
            <i class="fas fa-calendar-alt me-2"></i>All Leaves
          </a>
          <a routerLink="/companies" class="list-group-item list-group-item-action bg-transparent text-white">
            <i class="fas fa-building me-2"></i>Companies
          </a>
          <a routerLink="/departments" class="list-group-item list-group-item-action bg-transparent text-white">
            <i class="fas fa-sitemap me-2"></i>Departments
          </a>
          <a routerLink="/leave-types" class="list-group-item list-group-item-action bg-transparent text-white">
            <i class="fas fa-list me-2"></i>Leave Types
          </a>
        </div>
      </div>
    </div>
  `
})
export class SidebarComponent {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}
