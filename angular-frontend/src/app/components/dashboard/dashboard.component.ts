
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LeaveService } from '../../services/leave.service';
import { EmployeeService } from '../../services/employee.service';
import { User } from '../../models/user.model';
import { Leave } from '../../models/leave.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h1 class="h3 mb-4">Dashboard</h1>
      </div>
    </div>

    <div class="row" *ngIf="currentUser">
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Available Leave Days
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ currentUser.AVELEAVE }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-calendar fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Approved Leaves
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ approvedLeaves }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-check fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-warning shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Pending Leaves
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ pendingLeaves }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-clock fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-danger shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                  Rejected Leaves
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ rejectedLeaves }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-times fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Recent Leave Applications</h6>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Date From</th>
                    <th>Date To</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let leave of recentLeaves">
                    <td>{{ leave.DATESTART }}</td>
                    <td>{{ leave.DATEEND }}</td>
                    <td>{{ leave.TYPEOFLEAVE }}</td>
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
                    <td>{{ leave.NODAYS }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentLeaves: Leave[] = [];
  approvedLeaves = 0;
  pendingLeaves = 0;
  rejectedLeaves = 0;

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    if (this.currentUser) {
      this.loadLeaveStats();
    }
  }

  loadLeaveStats() {
    if (this.currentUser) {
      this.leaveService.getLeavesByEmployee(this.currentUser.EMPLOYID).subscribe({
        next: (leaves) => {
          this.recentLeaves = leaves.slice(0, 5);
          this.approvedLeaves = leaves.filter(l => l.LEAVESTATUS === 'APPROVED').length;
          this.pendingLeaves = leaves.filter(l => l.LEAVESTATUS === 'PENDING').length;
          this.rejectedLeaves = leaves.filter(l => l.LEAVESTATUS === 'REJECTED').length;
        }
      });
    }
  }
}
