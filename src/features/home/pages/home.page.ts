import { CommonModule, DecimalPipe, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { PopularMoviesStore } from '../home.store';

@Component({
  selector: 'app-movie-cards',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
  imports: [NgFor, NgClass, DecimalPipe, CommonModule],
})
export class MovieCardsComponent {
  genres: any[] = [];

  constructor(protected movieStore: PopularMoviesStore) {}

  ngOnInit() {
    this.movieStore.loadPopularMovies(1);
  }

  ratingColor(rating: number): 'green' | 'orange' | 'red' {
    if (rating >= 7) return 'green';
    if (rating >= 5) return 'orange';
    return 'red';
  }
}
