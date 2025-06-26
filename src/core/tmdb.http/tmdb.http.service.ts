import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TmdbApiService {
  private base = environment.tmdb.tmdbBaseUrl;
  private apiKey = environment.tmdb.tmdbApiKey;
  private language = environment.tmdb.defaultLang;

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1): Observable<any> {
    const url = `${this.base}/movie/popular`;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString());

    return this.http.get(url, { params });
  }

  getGenres(): Observable<any> {
    const url = `${this.base}/genre/movie/list`;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', this.language);

    return this.http.get(url, { params });
  }

  getTopRatedMovies(): Observable<any> {
    return this.http.get(`${this.base}/movie/top_rated`, {
      params: {
        api_key: this.apiKey,
      },
    });
  }

  discoverMovies(options: {
    page?: number;
    with_genres?: string;
    primary_release_year?: string;
  }): Observable<any> {
    let params = new HttpParams().set('api_key', this.apiKey);
    if (options.page) params = params.set('page', options.page.toString());
    if (options.with_genres)
      params = params.set('with_genres', options.with_genres);
    if (options.primary_release_year)
      params = params.set('primary_release_year', options.primary_release_year);

    return this.http.get(`${this.base}/discover/movie`, { params });
  }
}
