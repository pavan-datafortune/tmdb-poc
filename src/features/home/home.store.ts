import { Injectable, signal } from '@angular/core';
import { TmdbApiService } from '../../core/tmdb.http/tmdb.http.service';

interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

@Injectable({ providedIn: 'root' })
export class PopularMoviesStore {
  private movies = signal<Movie[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);
  private page = signal(1);

  readonly moviesList = this.movies.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  genres: any[] = [];

  constructor(private tmdb: TmdbApiService) {}

  loadPopularMovies(page = 1) {
    if (this.loading()) return;
    this.loading.set(true);
    this.page.set(page);

    this.tmdb.getPopularMovies(page).subscribe({
      next: (res) => {
        this.movies.set(res.results);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.status_message ?? 'Network error');
        this.loading.set(false);
      },
    });
  }
}
