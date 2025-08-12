
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { LeaveType } from '../../../models/leave.model';

@Component({
  selector: 'app-leave-type-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header">
            <h4>Leave Types</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Leave Type</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let leaveType of leaveTypes">
                    <td>{{ leaveType.LEAVTID }}</td>
                    <td>{{ leaveType.LEAVETYPE }}</td>
                    <td>{{ leaveType.DESCRIPTION }}</td>
                    <td>
                      <button class="btn btn-sm btn-primary me-2" 
                              (click)="editLeaveType(leaveType)">
                        Edit
                      </button>
                      <button class="btn btn-sm btn-danger" 
                              (click)="deleteLeaveType(leaveType.LEAVTID)">
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
            <h4>{{ isEdit ? 'Edit Leave Type' : 'Add Leave Type' }}</h4>
          </div>
          <div class="card-body">
            <form [formGroup]="leaveTypeForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Leave Type</label>
                <input type="text" class="form-control" formControlName="LEAVETYPE">
              </div>
              
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" rows="3" formControlName="DESCRIPTION"></textarea>
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" [disabled]="!leaveTypeForm.valid || loading">
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
export class LeaveTypeListComponent implements OnInit {
  leaveTypes: LeaveType[] = [];
  leaveTypeForm: FormGroup;
  isEdit = false;
  editingId: number | null = null;
  loading = false;

  constructor(
    private leaveService: LeaveService,
    private formBuilder: FormBuilder
  ) {
    this.leaveTypeForm = this.formBuilder.group({
      LEAVETYPE: ['', Validators.required],
      DESCRIPTION: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadLeaveTypes();
  }

  loadLeaveTypes() {
    this.leaveService.getLeaveTypes().subscribe({
      next: (leaveTypes) => this.leaveTypes = leaveTypes
    });
  }

  onSubmit() {
    if (this.leaveTypeForm.valid) {
      this.loading = true;
      
      const leaveType: LeaveType = this.leaveTypeForm.value;
      
      if (this.isEdit && this.editingId) {
        leaveType.LEAVTID = this.editingId;
        this.leaveService.updateLeaveType(leaveType).subscribe({
          next: () => {
            this.loadLeaveTypes();
            this.resetForm();
            this.loading = false;
          },
          error: () => this.loading = false
        });
      } else {
        this.leaveService.createLeaveType(leaveType).subscribe({
          next: () => {
            this.loadLeaveTypes();
            this.resetForm();
            this.loading = false;
          },
          error: () => this.loading = false
        });
      }
    }
  }

  editLeaveType(leaveType: LeaveType) {
    this.isEdit = true;
    this.editingId = leaveType.LEAVTID;
    this.leaveTypeForm.patchValue(leaveType);
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.leaveTypeForm.reset();
    this.isEdit = false;
    this.editingId = null;
  }

  deleteLeaveType(id: number) {
    if (confirm('Are you sure you want to delete this leave type?')) {
      this.leaveService.deleteLeaveType(id).subscribe({
        next: () => this.loadLeaveTypes()
      });
    }
  }
}
