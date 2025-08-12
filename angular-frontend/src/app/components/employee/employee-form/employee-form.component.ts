
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { CompanyService } from '../../../services/company.service';
import { DepartmentService } from '../../../services/department.service';
import { User } from '../../../models/user.model';
import { Company } from '../../../models/company.model';
import { Department } from '../../../models/department.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header">
            <h4>{{ isEdit ? 'Edit Employee' : 'Add Employee' }}</h4>
          </div>
          <div class="card-body">
            <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Employee Name</label>
                    <input type="text" class="form-control" formControlName="EMPNAME">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Employee ID</label>
                    <input type="text" class="form-control" formControlName="EMPLOYID">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" formControlName="USERNAME">
                  </div>
                </div>
                <div class="col-md-6" *ngIf="!isEdit">
                  <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" formControlName="PASSWRD">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Position</label>
                    <select class="form-control" formControlName="EMPPOSITION">
                      <option value="">Select Position</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Manager user">Manager</option>
                      <option value="Supervisor user">Supervisor</option>
                      <option value="Normal user">Normal User</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Gender</label>
                    <select class="form-control" formControlName="EMPSEX">
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Company</label>
                    <select class="form-control" formControlName="COMPANY">
                      <option value="">Select Company</option>
                      <option *ngFor="let company of companies" [value]="company.COMPANY">
                        {{ company.COMPANY }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Department</label>
                    <select class="form-control" formControlName="DEPARTMENT">
                      <option value="">Select Department</option>
                      <option *ngFor="let dept of departments" [value]="dept.DEPTNAME">
                        {{ dept.DEPTNAME }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="row" *ngIf="isEdit">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Available Leave Days</label>
                    <input type="number" class="form-control" formControlName="AVELEAVE">
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="button" class="btn btn-secondary me-md-2" (click)="goBack()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="!employeeForm.valid || loading">
                  {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  companies: Company[] = [];
  departments: Department[] = [];
  isEdit = false;
  employeeId: number | null = null;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.formBuilder.group({
      EMPNAME: ['', Validators.required],
      EMPLOYID: ['', Validators.required],
      USERNAME: ['', [Validators.required, Validators.email]],
      PASSWRD: [''],
      EMPPOSITION: ['', Validators.required],
      EMPSEX: ['', Validators.required],
      COMPANY: ['', Validators.required],
      DEPARTMENT: ['', Validators.required],
      AVELEAVE: [18]
    });
  }

  ngOnInit() {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.employeeId;
    
    if (!this.isEdit) {
      this.employeeForm.get('PASSWRD')?.setValidators([Validators.required]);
    }
    
    this.loadCompanies();
    this.loadDepartments();
    
    if (this.isEdit) {
      this.loadEmployee();
    }
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe({
      next: (companies) => this.companies = companies
    });
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => this.departments = departments
    });
  }

  loadEmployee() {
    if (this.employeeId) {
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (employee) => {
          this.employeeForm.patchValue(employee);
        }
      });
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.loading = true;
      
      const employee: User = this.employeeForm.value;
      
      if (this.isEdit && this.employeeId) {
        employee.EMPID = this.employeeId;
        this.employeeService.updateEmployee(employee).subscribe({
          next: () => {
            this.router.navigate(['/employees']);
            this.loading = false;
          },
          error: () => this.loading = false
        });
      } else {
        this.employeeService.createEmployee(employee).subscribe({
          next: () => {
            this.router.navigate(['/employees']);
            this.loading = false;
          },
          error: () => this.loading = false
        });
      }
    }
  }

  goBack() {
    this.router.navigate(['/employees']);
  }
}
