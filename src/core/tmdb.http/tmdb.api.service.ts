import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { TmdbAuthService } from '../auth/auth.service';
import { Genre } from '../store/movies.store';

@Injectable({ providedIn: 'root' })
export class TmdbApiService {
  auth = inject(TmdbAuthService);
  http = inject(HttpClient);

  private base = environment.tmdb.tmdbBaseUrl;
  private language = environment.tmdb.defaultLang;

  getPopularMovies(page = 1, query = ''): Observable<any> {
    const isSearch = query.trim().length > 0;
    const url = isSearch
      ? `${this.base}/search/multi`
      : `${this.base}/movie/popular`;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('query', query);

    return this.http.get(url, { params });
  }

  getTopRatedMovies(page = 1, query = ''): Observable<any> {
    const isSearch = query.trim().length > 0;
    const url = isSearch
      ? `${this.base}/search/multi`
      : `${this.base}/movie/top_rated`;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('query', query);

    return this.http.get(url, { params });
  }

  getUpcomingMovies(page = 1, query = ''): Observable<any> {
    const isSearch = query.trim().length > 0;
    const url = isSearch
      ? `${this.base}/search/multi`
      : `${this.base}/movie/upcoming`;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('query', query);

    return this.http.get(url, { params });
  }

  getGenres(): Observable<{ genres: Genre[] }> {
    const url = `${this.base}/genre/movie/list`;
    return this.http.get<{ genres: Genre[] }>(url, {
      params: new HttpParams().set('language', this.language),
    });
  }

  getMovieDetails(id: string): Observable<any> {
    return this.http.get(`${this.base}/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar',
      },
    });
  }

  getFavorites(page = 1): Observable<any[]> {
    const url = `${this.base}/account/${this.auth.currentUserId}/favorite/movies`;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('session_id', this.auth.sessionId!.toString());

    return this.http.get<any>(url, { params }).pipe(map((res) => res.results));
  }

  setFavorite(movieId: number, fav: boolean): Observable<any> {
    const url = `${this.base}/account/${this.auth.currentUserId}/favorite`;

    const params = new HttpParams().set('session_id', this.auth.sessionId!);

    return this.http.post(
      url,
      {
        media_type: 'movie',
        media_id: movieId,
        favorite: fav,
      },
      { params }
    );
  }

  rateMovie(movieId: number, rating: number): Observable<any> {
    const url = `${this.base}/movie/${movieId}/rating`;
    return this.http.post(
      url,
      { value: rating },
      {
        params: { session_id: this.auth.sessionId!.toString() },
      }
    );
  }

  removeRating(movieId: number): Observable<any> {
    const url = `${this.base}/movie/${movieId}/rating`;
    return this.http.delete(url, {
      params: { session_id: this.auth.sessionId!.toString() },
    });
  }

  getUserAccountStates(movieId: number): Observable<{ rated: any }> {
    const url = `${this.base}/movie/${movieId}/account_states`;
    return this.http.get<{ rated: any }>(url, {
      params: { session_id: this.auth.sessionId!.toString() },
    });
  }
}
