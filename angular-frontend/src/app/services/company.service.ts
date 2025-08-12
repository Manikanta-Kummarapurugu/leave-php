
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:5000/api/companies';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/list.php`);
  }

  getCompany(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/get.php?id=${id}`);
  }

  createCompany(company: Company): Observable<any> {
    return this.http.post(`${this.apiUrl}/create.php`, company);
  }

  updateCompany(company: Company): Observable<any> {
    return this.http.put(`${this.apiUrl}/update.php`, company);
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete.php?id=${id}`);
  }
}
