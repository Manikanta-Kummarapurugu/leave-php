
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5000/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/list.php`);
  }

  getEmployee(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/get.php?id=${id}`);
  }

  createEmployee(employee: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/create.php`, employee);
  }

  updateEmployee(employee: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/update.php`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete.php?id=${id}`);
  }
}
