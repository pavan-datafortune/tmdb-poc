import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbAuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  auth = inject(TmdbAuthService);
}
