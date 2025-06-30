import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbApiService } from '../../../core/tmdb.http/tmdb.http.service';
import { NumberSpacePipe } from '../../../shared/pipe/number-space.pipe';
import { DurationFormatPipe } from '../../../shared/pipe/duration-format.pipe';
import { CommonModule, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-movie-detail',
  imports: [NumberSpacePipe, DurationFormatPipe, CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css',
  // providers: [NgFor, NgClass],
})
export class MovieDetailComponent {
  movie: any = null;
  loading = true;
  error: string | null = null;

  showAllCast = false;

  constructor(private route: ActivatedRoute, private tmdb: TmdbApiService) {
    const id = this.route.snapshot.paramMap.get('movieId')!;
    this.tmdb.getMovieDetails(id).subscribe({
      next: (data: any) => {
        this.movie = data;

        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.status_message ?? 'Network error';
        this.loading = false;
      },
    });
  }

  get castWithPhotos() {
    return (
      this.movie?.credits?.cast?.filter((c: any) => !!c.profile_path) || []
    );
  }

  toggleCast() {
    this.showAllCast = !this.showAllCast;
  }
}
