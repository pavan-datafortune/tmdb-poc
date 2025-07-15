import { Component, inject, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TmdbApiService } from '../../../core/tmdb.http/tmdb.http.service';
import { MoviesStore } from '../../../features/movies-list/movies.store';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-rate-movie-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSliderModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: `./rate.movie-dialog.component.html`,
  styleUrls: [`./rate.movie-dialog.component.css`],
})
export class RateMovieDialog {
  private movieStore = inject(MoviesStore);
  private tmdb = inject(TmdbApiService);

  disabled = false;
  max = 10;
  min = 0;
  showTicks = false;
  step = 0.5;
  thumbLabel = true;
  value = 0;

  showDeleteButton = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { movieId: number; title: string; currentRating: number },
    private dialogRef: MatDialogRef<RateMovieDialog>
  ) {
    this.value = data.currentRating || 0;
    this.showDeleteButton = data.currentRating > 0;
  }

  submit() {
    this.tmdb.rateMovie(this.data.movieId, this.value).subscribe(() => {
      this.movieStore.emitRatingChange(this.data.movieId, this.value);
      this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }

  remove() {
    this.tmdb.removeRating(this.data.movieId).subscribe(() => {
      this.movieStore.emitRatingChange(this.data.movieId, null);
      this.dialogRef.close();
    });
  }
}
