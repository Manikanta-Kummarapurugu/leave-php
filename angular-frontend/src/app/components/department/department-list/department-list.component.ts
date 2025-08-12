
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header">
            <h4>Departments</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Department Name</th>
                    <th>Short Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let department of departments">
                    <td>{{ department.DEPTID }}</td>
                    <td>{{ department.DEPTNAME }}</td>
                    <td>{{ department.DEPTSHORTNAME }}</td>
                    <td>
                      <button class="btn btn-sm btn-primary me-2" 
                              (click)="editDepartment(department)">
                        Edit
                      </button>
                      <button class="btn btn-sm btn-danger" 
                              (click)="deleteDepartment(department.DEPTID)">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-header">
            <h4>{{ isEdit ? 'Edit Department' : 'Add Department' }}</h4>
          </div>
          <div class="card-body">
            <form [formGroup]="departmentForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Department Name</label>
                <input type="text" class="form-control" formControlName="DEPTNAME">
              </div>
              
              <div class="mb-3">
                <label class="form-label">Short Name</label>
                <input type="text" class="form-control" formControlName="DEPTSHORTNAME">
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" [disabled]="!departmentForm.valid || loading">
                  {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Add') }}
                </button>
                <button type="button" class="btn btn-secondary mt-2" 
                        (click)="cancelEdit()" *ngIf="isEdit">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  departmentForm: FormGroup;
  isEdit = false;
  editingId: number | null = null;
  loading = false;

  constructor(
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder
  ) {
    this.departmentForm = this.formBuilder.group({
      DEPTNAME: ['', Validators.required],
      DEPTSHORTNAME: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => this.departments = departments
    });
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      this.loading = true;
      
      const department: Department = this.departmentForm.value;
      
      if (this.isEdit && this.editingId) {
        department.DEPTID = this.editingId;
        this.departmentService.updateDepartment(department).subscribe({
          next: () => {
            this.loadDepartments();
            this.resetForm();
            this.loading = false;
          },
          error: () => this.loading = false
        });
      } else {
        this.departmentService.createDepartment(department).subscribe({
          next: () => {
            this.loadDepartments();
            this.resetForm();
            this.loading = false;
          },
          error: () => this.loading = false
        });
      }
    }
  }

  editDepartment(department: Department) {
    this.isEdit = true;
    this.editingId = department.DEPTID;
    this.departmentForm.patchValue(department);
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.departmentForm.reset();
    this.isEdit = false;
    this.editingId = null;
  }

  deleteDepartment(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => this.loadDepartments()
      });
    }
  }
}
