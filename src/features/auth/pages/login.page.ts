import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from '@/core/services/auth.service';

@Component({
  standalone: true,
  selector: 'mm-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})

export class LoginPage {
  form: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    // private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
