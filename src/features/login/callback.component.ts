import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TmdbAuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-callback',
  imports: [CommonModule],
  template: ` <div
    style="
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
  "
  >
    <div class="spinner"></div>
  </div>`,
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
        this.auth.saveSession(sessionId);
        this.auth.getAccountInfo(sessionId);
        this.router.navigate(['/movies']);
      },
      error: () => {
        alert('Login failed. Please try again.');
        this.router.navigate(['/login']);
      },
    });
  }
}
