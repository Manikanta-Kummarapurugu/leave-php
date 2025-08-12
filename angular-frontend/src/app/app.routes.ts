
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'employees', 
    loadComponent: () => import('./components/employee/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'employees/add', 
    loadComponent: () => import('./components/employee/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'employees/edit/:id', 
    loadComponent: () => import('./components/employee/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'leaves', 
    loadComponent: () => import('./components/leave/leave-list/leave-list.component').then(m => m.LeaveListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'leaves/add', 
    loadComponent: () => import('./components/leave/leave-form/leave-form.component').then(m => m.LeaveFormComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'leaves/edit/:id', 
    loadComponent: () => import('./components/leave/leave-form/leave-form.component').then(m => m.LeaveFormComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'companies', 
    loadComponent: () => import('./components/company/company-list/company-list.component').then(m => m.CompanyListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'departments', 
    loadComponent: () => import('./components/department/department-list/department-list.component').then(m => m.DepartmentListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'leave-types', 
    loadComponent: () => import('./components/leave-type/leave-type-list/leave-type-list.component').then(m => m.LeaveTypeListComponent),
    canActivate: [AuthGuard]
  }
];
