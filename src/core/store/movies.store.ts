import { inject, Injectable, signal } from '@angular/core';
import { TmdbApiService } from '../tmdb.http/tmdb.http.service';
import { map, Observable, Subject, switchMap, tap } from 'rxjs';

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
  isFavorite: boolean;
}
@Injectable({ providedIn: 'root' })
export class MoviesStore {
  tmdbApi = inject(TmdbApiService);
  private genreMap: Record<number, string> = {};

  private ratingChangedSubject = new Subject<{
    movieId: number;
    rating: number | null;
  }>();

  ratingChanged$ = this.ratingChangedSubject.asObservable();

  private movies = signal<Movie[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);
  private favIds = signal<Set<number>>(new Set());
  private page = signal(1);
  private category = 'popular';

  readonly moviesList = this.movies.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly currentPage = this.page.asReadonly();
  readonly errorMessage = this.error.asReadonly();
  readonly favouriteIds = this.favIds.asReadonly();

  refreshFavorites(): Observable<Set<number>> {
    return this.tmdbApi.getFavorites().pipe(
      tap((list) => this.favIds.set(new Set(list.map((m) => m.id)))),
      map(() => this.favIds())
    );
  }

  toggleFavorite(id: number, makeFav: boolean): void {
    this.tmdbApi.setFavorite(id, makeFav).subscribe({
      next: () => {
        this.refreshFavorites()
          .pipe(
            tap(() => this.loadMovies(this.category as any, this.page(), ''))
          )
          .subscribe();
      },
      error: () => this.error.set('Favourite update failed'),
    });
  }

  emitRatingChange(movieId: number, rating: number | null) {
    this.ratingChangedSubject.next({ movieId, rating });
  }

  loadMovies(
    category: 'popular' | 'top_rated' | 'upcoming' | 'favorites',
    page = 1,
    query = ''
  ): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.page.set(page);
    this.category = category;

    this.tmdbApi.getGenres().subscribe({
      next: (res) => {
        this.genreMap = {};
        res.genres.forEach((g: Genre) => {
          this.genreMap[g.id] = g.name;
        });

        const endpoint =
          category === 'favorites'
            ? this.tmdbApi.getFavorites()
            : category === 'top_rated'
            ? this.tmdbApi.getTopRatedMovies(page, query)
            : category === 'upcoming'
            ? this.tmdbApi.getUpcomingMovies(page, query)
            : this.tmdbApi.getPopularMovies(page, query);

        const stream =
          category === 'favorites' || this.favIds().size
            ? endpoint
            : this.refreshFavorites().pipe(switchMap(() => endpoint));

        stream.subscribe({
          next: (res) => {
            const rawList = category === 'favorites' ? res : res.results;

            const list = rawList.map((rawData: any) =>
              this.attachGenresAndFav(rawData)
            );

            this.movies.set(list);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err?.status_message ?? 'Network error');
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.error.set('Failed to load genres');
        this.loading.set(false);
      },
    });
  }

  private attachGenresAndFav(raw: any): Movie & { isFavorite: boolean } {
    const genres: Genre[] = (raw.genre_ids || []).map((id: number) => ({
      id,
      name: this.genreMap[id] ?? 'Unknown',
    }));

    return {
      ...raw,
      genres,
      isFavorite: this.favIds().has(raw.id),
    };
  }
}
