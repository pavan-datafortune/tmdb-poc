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
import { MatDialog } from '@angular/material/dialog';
import { RateMovieDialog } from '../../../shared/components/rate.movie-dailog/rate.movie-dialog/rate.movie-dialog.component';

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
  private dialog = inject(MatDialog);

  movieStore = inject(MoviesStore);
  movieDetails: any = null;
  loading = true;
  error: string | null = null;
  userRating: any = null;

  ratedMovies: Record<number, number> = {};

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

          this.tmdb.getUserAccountStates(data?.id).subscribe((res) => {
            this.userRating = res.rated.value;
          });
        },
        error: (err) => {
          this.error = err?.status_message ?? 'Network error';
          this.loading = false;
        },
      });

    this.movieStore.ratingChanged$.subscribe(({ movieId, rating }) => {
      this.userRating = rating;
      if (rating) this.ratedMovies[movieId] = rating;
      else delete this.ratedMovies[movieId];
    });
  }

  openRatingDialog(movie: Movie) {
    this.dialog.open(RateMovieDialog, {
      data: {
        movieId: movie.id,
        title: movie.title,
        currentRating: this.userRating,
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
