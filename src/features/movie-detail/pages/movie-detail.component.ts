import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbApiService } from '../../../core/tmdb.http/tmdb.http.service';
import { NumberSpacePipe } from '../../../shared/pipe/number-space.pipe';
import { DurationFormatPipe } from '../../../shared/pipe/duration-format.pipe';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { Genre, Movie, MoviesStore } from '../../movies-list/movies.store';
import { map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movie-detail',
  imports: [
    NumberSpacePipe,
    DurationFormatPipe,
    CommonModule,
    MovieCardComponent,
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
})
export class MovieDetailComponent {
  private readonly tmdb = inject(TmdbApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  movieStore = inject(MoviesStore);
  movieDetails: any = null;
  loading = true;
  error: string | null = null;

  showAllCast = false;
  showRecommendations = false;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((p) => p.get('movieId')),
        tap(() => {
          this.loading = true;
          this.error = null;
        }),
        switchMap((id) => this.tmdb.getMovieDetails(id!)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          this.movieDetails = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err?.status_message ?? 'Network error';
          this.loading = false;
        },
      });
  }

  get castWithPhotos() {
    return (
      this.movieDetails?.credits?.cast?.filter(
        (cast: any) => !!cast.profile_path
      ) || []
    );
  }

  get recommendationList(): (Movie & { genres: Genre[] })[] {
    return (
      this.movieDetails?.similar?.results?.filter(
        (m: Movie) => !!m.poster_path
      ) || []
    );
  }

  toggleCast() {
    this.showAllCast = !this.showAllCast;
  }

  toggleRecommendationList() {
    this.showRecommendations = !this.showRecommendations;
  }
}
