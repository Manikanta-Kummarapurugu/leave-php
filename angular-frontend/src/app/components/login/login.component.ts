
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5">
          <div class="card shadow-lg border-0 rounded-lg mt-5">
            <div class="card-header">
              <h3 class="text-center font-weight-light my-4">Login</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="form-floating mb-3">
                  <input 
                    class="form-control" 
                    formControlName="username" 
                    type="email" 
                    placeholder="name@example.com" />
                  <label for="username">Email address</label>
                </div>
                <div class="form-floating mb-3">
                  <input 
                    class="form-control" 
                    formControlName="password" 
                    type="password" 
                    placeholder="Password" />
                  <label for="password">Password</label>
                </div>
                <div class="d-grid">
                  <button 
                    class="btn btn-primary btn-block" 
                    type="submit" 
                    [disabled]="!loginForm.valid || loading">
                    {{ loading ? 'Signing in...' : 'Sign in' }}
                  </button>
                </div>
              </form>
              <div *ngIf="error" class="alert alert-danger mt-3">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.error = response.message;
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Login failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}
