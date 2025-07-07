import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  startWith,
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MoviesStore } from './movies.store';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-page',
  standalone: true,
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.css'],
  imports: [
    CommonModule,
    NgFor,
    RouterModule,
    ReactiveFormsModule,
    MovieCardComponent,
  ],
})
export class MoviesPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected movieStore = inject(MoviesStore);
  private destroyRef = inject(DestroyRef);

  filterForm = this.fb.group({
    category: 'popular',
    query: '',
  });

  ngOnInit(): void {
    this.movieStore.loadMovies('popular');

    this.filterForm
      .get('category')!
      .valueChanges.pipe(
        startWith('popular'),
        distinctUntilChanged(),
        tap(() => {
          this.movieStore.loadMovies(this.category(), 1, this.query());
          this.filterForm.get('query')!.setValue('');
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.filterForm
      .get('query')!
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.movieStore.loadMovies(this.category(), 1, this.query());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  nextPage(): void {
    this.movieStore.loadMovies(
      this.category(),
      this.movieStore.currentPage() + 1,
      this.query()
    );
  }

  previousPage(): void {
    const p = this.movieStore.currentPage();
    if (p > 1) {
      this.movieStore.loadMovies(this.category(), p - 1, this.query());
    }
  }

  private category() {
    return this.filterForm.get('category')!.value as
      | 'popular'
      | 'top_rated'
      | 'upcoming'
      | 'favorites';
  }

  private query() {
    return this.filterForm.get('query')!.value ?? '';
  }
}
