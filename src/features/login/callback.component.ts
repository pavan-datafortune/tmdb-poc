import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TmdbAuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-callback',
  imports: [CommonModule],
  template: `<p style="padding:2rem;color:white">Finishing login…</p>`,
})
export class CallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(TmdbAuthService);
  private router = inject(Router);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('request_token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.auth.exchangeTokenForSession(token).subscribe({
      next: (sessionId) => {
        this.auth.getAccountInfo(sessionId);
        this.auth.saveSession(sessionId);
        this.router.navigate(['/movies']);
      },
      error: () => {
        alert('Login failed. Please try again.');
        this.router.navigate(['/login']);
      },
    });
  }
}
