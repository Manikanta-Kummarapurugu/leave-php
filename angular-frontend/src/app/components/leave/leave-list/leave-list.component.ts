
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeaveService } from '../../../services/leave.service';
import { AuthService } from '../../../services/auth.service';
import { Leave } from '../../../models/leave.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Leave Applications</h1>
      <a routerLink="/leaves/add" class="btn btn-primary" *ngIf="currentUser?.EMPPOSITION === 'Normal user'">
        <i class="fas fa-plus"></i> Apply Leave
      </a>
    </div>

    <div class="card shadow">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Date From</th>
                <th>Date To</th>
                <th>Days</th>
                <th>Shift</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Date Posted</th>
                <th *ngIf="canManageLeaves()">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let leave of leaves">
                <td>{{ leave.EMPLOYID }}</td>
                <td>{{ leave.DATESTART }}</td>
                <td>{{ leave.DATEEND }}</td>
                <td>{{ leave.NODAYS }}</td>
                <td>{{ leave.SHIFTTIME }}</td>
                <td>{{ leave.TYPEOFLEAVE }}</td>
                <td>{{ leave.REASON }}</td>
                <td>
                  <span class="badge" 
                        [ngClass]="{
                          'bg-success': leave.LEAVESTATUS === 'APPROVED',
                          'bg-warning': leave.LEAVESTATUS === 'PENDING',
                          'bg-danger': leave.LEAVESTATUS === 'REJECTED'
                        }">
                    {{ leave.LEAVESTATUS }}
                  </span>
                </td>
                <td>{{ leave.ADMINREMARKS }}</td>
                <td>{{ leave.DATEPOSTED }}</td>
                <td *ngIf="canManageLeaves()">
                  <button class="btn btn-sm btn-primary me-2" 
                          (click)="approveLeave(leave)"
                          [disabled]="leave.LEAVESTATUS === 'APPROVED'">
                    Approve
                  </button>
                  <button class="btn btn-sm btn-danger" 
                          (click)="rejectLeave(leave)"
                          [disabled]="leave.LEAVESTATUS === 'REJECTED'">
                    Reject
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
export class LeaveListComponent implements OnInit {
  leaves: Leave[] = [];
  currentUser: User | null = null;

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    if (this.currentUser?.EMPPOSITION === 'Normal user') {
      this.leaveService.getLeavesByEmployee(this.currentUser.EMPLOYID).subscribe({
        next: (leaves) => this.leaves = leaves
      });
    } else {
      this.leaveService.getLeaves().subscribe({
        next: (leaves) => this.leaves = leaves
      });
    }
  }

  canManageLeaves(): boolean {
    return this.currentUser?.EMPPOSITION === 'Administrator' || 
           this.currentUser?.EMPPOSITION === 'Manager user' || 
           this.currentUser?.EMPPOSITION === 'Supervisor user';
  }

  approveLeave(leave: Leave) {
    const updatedLeave = { ...leave, LEAVESTATUS: 'APPROVED', ADMINREMARKS: 'Approved' };
    this.leaveService.updateLeave(updatedLeave).subscribe({
      next: () => this.loadLeaves()
    });
  }

  rejectLeave(leave: Leave) {
    const updatedLeave = { ...leave, LEAVESTATUS: 'REJECTED', ADMINREMARKS: 'Rejected' };
    this.leaveService.updateLeave(updatedLeave).subscribe({
      next: () => this.loadLeaves()
    });
  }
}
