
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:5000/api/departments';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/list.php`);
  }

  getDepartment(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/get.php?id=${id}`);
  }

  createDepartment(department: Department): Observable<any> {
    return this.http.post(`${this.apiUrl}/create.php`, department);
  }

  updateDepartment(department: Department): Observable<any> {
    return this.http.put(`${this.apiUrl}/update.php`, department);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete.php?id=${id}`);
  }
}
