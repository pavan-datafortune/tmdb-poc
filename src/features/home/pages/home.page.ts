import { CommonModule, DecimalPipe, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { PopularMoviesStore } from '../home.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-cards',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
  imports: [
    NgFor,
    NgClass,
    DecimalPipe,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class MovieCardsComponent {
  query = new FormControl('');

  constructor(protected movieStore: PopularMoviesStore) {}

  ngOnInit() {
    const res = this.movieStore.loadPopularMovies(1, '');

    this.query.valueChanges.subscribe((q) =>
      this.movieStore.loadPopularMovies(1, q ?? '')
    );
  }

  nextPage(): void {
    this.movieStore.loadPopularMovies(this.movieStore.currentPage() + 1, '');
  }

  previousPage(): void {
    const p = this.movieStore.currentPage();
    if (p > 1) {
      this.movieStore.loadPopularMovies(p - 1, '');
    }
  }

  ratingColor(rating: number): 'green' | 'orange' | 'red' {
    if (rating >= 7) return 'green';
    if (rating >= 5) return 'orange';
    return 'red';
  }
}
