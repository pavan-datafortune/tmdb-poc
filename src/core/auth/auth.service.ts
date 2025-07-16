// src/app/core/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TmdbAuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private username = signal<string>('');
  private userId = signal<number>(0);
  private isAuthenticated = signal<boolean>(
    !!localStorage.getItem('tmdb_session_id')
  );

  currentUserName = this.username.asReadonly();
  currentUserId = this.userId.asReadonly();

  startLoginFlow() {
    this.http
      .get<any>(`https://api.themoviedb.org/3/authentication/token/new`)
      .subscribe((res) => {
        const token = res.request_token;
        const url =
          `https://www.themoviedb.org/authenticate/${token}` +
          `?redirect_to=${encodeURIComponent(environment.redirectUrl)}`;
        window.location.href = url;
      });
  }

  exchangeTokenForSession(token: string): Observable<string> {
    const session_id = this.http
      .post<any>(`https://api.themoviedb.org/3/authentication/session/new`, {
        request_token: token,
      })
      .pipe(map((r) => r.session_id as string));

    this.isAuthenticated.set(true);

    return session_id;
  }

  getAccountInfo(sessionId: any) {
    const url = `https://api.themoviedb.org/3/account?session_id=${sessionId}`;

    return this.http.get<any>(url).subscribe((res) => {
      this.username.set(res.username);
      this.userId.set(res.id);
    });
  }

  saveSession(sessionId: string) {
    localStorage.setItem('tmdb_session_id', sessionId);
  }

  get sessionId() {
    return localStorage.getItem('tmdb_session_id');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  logout() {
    localStorage.removeItem('tmdb_session_id');
    this.isAuthenticated.set(false);
    this.userId.set(0);
    this.username.set('');
    this.router.navigate(['/login']);
  }
}
