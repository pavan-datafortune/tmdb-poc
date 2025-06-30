import { Injectable, signal } from '@angular/core';
import { TmdbApiService } from '../../core/tmdb.http/tmdb.http.service';

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  name: any;
  adult: boolean;
  backdrop_path: string | null;
  genres: Genre[];
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

  readonly currentPage = this.page.asReadonly();
  readonly moviesList = this.movies.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  private genreMap: Record<number, string> = {};

  constructor(private tmdb: TmdbApiService) {}

  getMovieGenres(): void {
    if (Object.keys(this.genreMap).length) return; // already cached
    this.tmdb.getGenres().subscribe({
      next: (res) => {
        this.genreMap = res.genres.reduce(
          (acc: Record<number, string>, g: Genre) => ({
            ...acc,
            [g.id]: g.name,
          }),
          {}
        );
      },
      error: (err) =>
        this.error.set(err.status_message ?? 'Genre fetch failed'),
    });
  }

  loadPopularMovies(page = 1, query: any): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.page.set(page);

    this.getMovieGenres();

    this.tmdb.getPopularMovies(page, query).subscribe({
      next: (res) => {
        const enriched = res.results.map((raw: any) => this.attachGenres(raw));
        this.movies.set(enriched);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.status_message ?? 'Network error');
        this.loading.set(false);
      },
    });
  }

  private attachGenres(raw: any): Movie {
    const genres: Genre[] = (raw.genre_ids || []).map((id: number) => ({
      id,
      name: this.genreMap[id] ?? 'Unknown',
    }));

    const { genre_ids, ...rest } = raw;
    return { ...rest, genres } as Movie;
  }
}
