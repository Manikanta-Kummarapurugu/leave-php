
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Leave, LeaveType } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:5000/api/leaves';
  private leaveTypeApiUrl = 'http://localhost:5000/api/leave-types';

  constructor(private http: HttpClient) {}

  getLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/list.php`);
  }

  getLeavesByEmployee(employeeId: string): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/list.php?employeeId=${employeeId}`);
  }

  getLeave(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.apiUrl}/get.php?id=${id}`);
  }

  createLeave(leave: Leave): Observable<any> {
    return this.http.post(`${this.apiUrl}/create.php`, leave);
  }

  updateLeave(leave: Leave): Observable<any> {
    return this.http.put(`${this.apiUrl}/update.php`, leave);
  }

  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete.php?id=${id}`);
  }

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(`${this.leaveTypeApiUrl}/list.php`);
  }

  createLeaveType(leaveType: LeaveType): Observable<any> {
    return this.http.post(`${this.leaveTypeApiUrl}/create.php`, leaveType);
  }

  updateLeaveType(leaveType: LeaveType): Observable<any> {
    return this.http.put(`${this.leaveTypeApiUrl}/update.php`, leaveType);
  }

  deleteLeaveType(id: number): Observable<any> {
    return this.http.delete(`${this.leaveTypeApiUrl}/delete.php?id=${id}`);
  }
}
