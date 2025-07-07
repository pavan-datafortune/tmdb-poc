// src/app/core/favorites.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { TmdbAuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private auth = inject(TmdbAuthService);
  private apiKey = environment.tmdb.tmdbApiKey;

  /** Needs the numeric account_id first */
  private get account$() {
    return this.http.get<any>(
      `https://api.themoviedb.org/3/account?api_key=${this.apiKey}&session_id=${this.auth.sessionId}`
    );
  }

  getFavorites() {
    return this.account$.pipe(
      switchMap((acc) =>
        this.http.get<any>(
          `https://api.themoviedb.org/3/account/${acc.id}/favorite/movies?api_key=${this.apiKey}&session_id=${this.auth.sessionId}`
        )
      ),
      map((r) => r.results as any[])
    );
  }

  /** Toggle fav */
  markFavorite(movieId: number, fav: boolean) {
    return this.account$.pipe(
      switchMap((acc) =>
        this.http.post(
          `https://api.themoviedb.org/3/account/${acc.id}/favorite?api_key=${this.apiKey}&session_id=${this.auth.sessionId}`,
          { media_type: 'movie', media_id: movieId, favorite: fav }
        )
      )
    );
  }
}
