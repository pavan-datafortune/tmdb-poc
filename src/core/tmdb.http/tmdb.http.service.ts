import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TmdbApiService {
  private base = environment.tmdb.tmdbBaseUrl;
  private language = environment.tmdb.defaultLang;

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1, query = ''): Observable<any> {
    const url = query.trim()
      ? `${this.base}/search/multi`
      : `${this.base}/movie/popular`;

    // const url = `${this.base}/movie/popular`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('query', query);

    return this.http.get(url, { params });
  }

  getGenres(): Observable<any> {
    const url = `${this.base}/genre/movie/list`;
    const params = new HttpParams().set('language', this.language);

    return this.http.get(url, { params });
  }

  getMovieDetails(movieId = ''): Observable<any> {
    const url = `${this.base}/movie`;

    return this.http.get<any>(`${url}/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar',
      },
    });
  }
}
