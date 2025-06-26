import { CommonModule, DecimalPipe, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TmdbApiService } from '../../../core/tmdb.http/tmdb.http.service';

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

@Component({
  selector: 'app-movie-cards',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
  imports: [NgFor, NgClass, DecimalPipe, CommonModule],
})
export class MovieCardsComponent {
  movies: Movie[] = [];
  genres: any[] = [];

  constructor(private tmdb: TmdbApiService) {
    this.getHomePageContent();
  }

  async getHomePageContent() {
    await Promise.all([
      this.tmdb.getPopularMovies().subscribe((res) => {
        this.movies = res.results;
      }),

      this.tmdb.getGenres().subscribe((res) => {
        this.genres = res.results;
      }),
    ]);
  }

  ratingColor(rating: number): 'green' | 'orange' | 'red' {
    if (rating >= 7) return 'green';
    if (rating >= 5) return 'orange';
    return 'red';
  }
}
