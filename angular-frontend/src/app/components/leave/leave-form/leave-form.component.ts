
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveService } from '../../../services/leave.service';
import { AuthService } from '../../../services/auth.service';
import { Leave, LeaveType } from '../../../models/leave.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header">
            <h4>Apply for Leave</h4>
          </div>
          <div class="card-body">
            <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Employee ID</label>
                    <input type="text" class="form-control" [value]="currentUser?.EMPLOYID" readonly>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" [value]="currentUser?.EMPNAME" readonly>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Date From</label>
                    <input type="date" class="form-control" formControlName="DATESTART">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Date To</label>
                    <input type="date" class="form-control" formControlName="DATEEND">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Shift Time</label>
                    <select class="form-control" formControlName="SHIFTTIME">
                      <option value="">Select Shift</option>
                      <option value="All Day">All Day</option>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Leave Type</label>
                    <select class="form-control" formControlName="TYPEOFLEAVE">
                      <option value="">Select Leave Type</option>
                      <option *ngFor="let type of leaveTypes" [value]="type.LEAVETYPE">
                        {{ type.LEAVETYPE }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Reason</label>
                <textarea class="form-control" rows="3" formControlName="REASON"></textarea>
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="button" class="btn btn-secondary me-md-2" (click)="goBack()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="!leaveForm.valid || loading">
                  {{ loading ? 'Submitting...' : 'Submit Leave Application' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaveFormComponent implements OnInit {
  leaveForm: FormGroup;
  leaveTypes: LeaveType[] = [];
  currentUser: User | null = null;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private leaveService: LeaveService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.leaveForm = this.formBuilder.group({
      DATESTART: ['', Validators.required],
      DATEEND: ['', Validators.required],
      SHIFTTIME: ['', Validators.required],
      TYPEOFLEAVE: ['', Validators.required],
      REASON: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadLeaveTypes();
  }

  loadLeaveTypes() {
    this.leaveService.getLeaveTypes().subscribe({
      next: (types) => this.leaveTypes = types
    });
  }

  onSubmit() {
    if (this.leaveForm.valid && this.currentUser) {
      this.loading = true;
      
      const leave: Leave = {
        ...this.leaveForm.value,
        EMPLOYID: this.currentUser.EMPLOYID,
        NODAYS: 0, // Will be calculated in backend
        LEAVESTATUS: 'PENDING',
        ADMINREMARKS: 'N/A',
        DATEPOSTED: new Date().toISOString().split('T')[0]
      };

      this.leaveService.createLeave(leave).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/leaves']);
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/leaves']);
  }
}
