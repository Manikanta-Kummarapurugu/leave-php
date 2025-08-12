
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Employees</h1>
      <a routerLink="/employees/add" class="btn btn-primary">
        <i class="fas fa-plus"></i> Add Employee
      </a>
    </div>

    <div class="card shadow">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Company</th>
                <th>Department</th>
                <th>Available Leave</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of employees">
                <td>{{ employee.EMPLOYID }}</td>
                <td>{{ employee.EMPNAME }}</td>
                <td>{{ employee.EMPPOSITION }}</td>
                <td>{{ employee.USERNAME }}</td>
                <td>{{ employee.EMPSEX }}</td>
                <td>{{ employee.COMPANY }}</td>
                <td>{{ employee.DEPARTMENT }}</td>
                <td>{{ employee.AVELEAVE }}</td>
                <td>
                  <span class="badge" 
                        [ngClass]="employee.ACCSTATUS === 'YES' ? 'bg-success' : 'bg-danger'">
                    {{ employee.ACCSTATUS === 'YES' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-primary me-2" 
                          [routerLink]="['/employees/edit', employee.EMPID]">
                    Edit
                  </button>
                  <button class="btn btn-sm btn-danger" 
                          (click)="deleteEmployee(employee.EMPID)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  employees: User[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => this.employees = employees
    });
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => this.loadEmployees()
      });
    }
  }
}
