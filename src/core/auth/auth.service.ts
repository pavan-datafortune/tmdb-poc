// src/app/core/tmdb-auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TmdbAuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiKey = environment.tmdb.tmdbApiKey;
  private username = signal<string>('');
  private userId = signal<string>('');

  currentUserName = this.username.asReadonly();
  currentUserId = this.userId.asReadonly();

  startLoginFlow() {
    this.http
      .get<any>(
        `https://api.themoviedb.org/3/authentication/token/new?api_key=${this.apiKey}`
      )
      .subscribe((res) => {
        const token = res.request_token;
        const url =
          `https://www.themoviedb.org/authenticate/${token}` +
          `?redirect_to=${encodeURIComponent(environment.redirectUrl)}`;
        window.location.href = url; // redirect to TMDB
      });
  }

  exchangeTokenForSession(token: string): Observable<string> {
    return this.http
      .post<any>(
        `https://api.themoviedb.org/3/authentication/session/new?api_key=${this.apiKey}`,
        { request_token: token }
      )
      .pipe(map((r) => r.session_id as string));
  }

  getAccountInfo(sessionId: any) {
    const url = `https://api.themoviedb.org/3/account?api_key=${this.apiKey}&session_id=${sessionId}`;

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

  logout() {
    localStorage.removeItem('tmdb_session_id');
    this.router.navigate(['/login']);
  }
}
