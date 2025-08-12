
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header">
            <h4>Companies</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let company of companies">
                    <td>{{ company.COMPID }}</td>
                    <td>{{ company.COMPANY }}</td>
                    <td>
                      <button class="btn btn-sm btn-primary me-2" 
                              (click)="editCompany(company)">
                        Edit
                      </button>
                      <button class="btn btn-sm btn-danger" 
                              (click)="deleteCompany(company.COMPID)">
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
            <h4>{{ isEdit ? 'Edit Company' : 'Add Company' }}</h4>
          </div>
          <div class="card-body">
            <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Company Name</label>
                <input type="text" class="form-control" formControlName="COMPANY">
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" [disabled]="!companyForm.valid || loading">
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
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  companyForm: FormGroup;
  isEdit = false;
  editingId: number | null = null;
  loading = false;

  constructor(
    private companyService: CompanyService,
    private formBuilder: FormBuilder
  ) {
    this.companyForm = this.formBuilder.group({
      COMPANY: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe({
      next: (companies) => this.companies = companies
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      this.loading = true;
      
      const company: Company = this.companyForm.value;
      
      if (this.isEdit && this.editingId) {
        company.COMPID = this.editingId;
        this.companyService.updateCompany(company).subscribe({
          next: () => {
            this.loadCompanies();
            this.resetForm();
            this.loading = false;
          },
          error: () => this.loading = false
        });
      } else {
        this.companyService.createCompany(company).subscribe({
          next: () => {
            this.loadCompanies();
            this.resetForm();
            this.loading = false;
          },
          error: () => this.loading = false
        });
      }
    }
  }

  editCompany(company: Company) {
    this.isEdit = true;
    this.editingId = company.COMPID;
    this.companyForm.patchValue(company);
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.companyForm.reset();
    this.isEdit = false;
    this.editingId = null;
  }

  deleteCompany(id: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(id).subscribe({
        next: () => this.loadCompanies()
      });
    }
  }
}
