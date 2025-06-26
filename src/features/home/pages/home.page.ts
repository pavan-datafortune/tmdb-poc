import { DecimalPipe, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

interface Movie {
  title: string;
  poster: string;
  rating: number;
  genres: string[];
}

@Component({
  selector: 'app-movie-cards',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
  imports: [NgFor, NgClass, DecimalPipe],
})
export class MovieCardsComponent {
  movies: Movie[] = [
    {
      title: 'Final Destination Bloodlines',
      poster: 'assets/final-destination.jpg',
      rating: 7.266,
      genres: ['Horror', 'Mystery'],
    },
    {
      title: 'The Twisters',
      poster: 'assets/twisters.jpg',
      rating: 5.833,
      genres: ['Action', 'Adventure', 'Drama'],
    },
    {
      title: 'Lilo & Stitch',
      poster: 'assets/lilo-stitch.jpg',
      rating: 7.1,
      genres: ['Family', 'Science Fiction', 'Comedy', 'Adventure'],
    },
    {
      title: 'Crazy Lizard',
      poster: 'assets/crazy-lizard.jpg',
      rating: 6.056,
      genres: ['Action', 'Thriller', 'Horror'],
    },
    {
      title: 'Distant',
      poster: 'assets/distant.jpg',
      rating: 6.283,
      genres: ['Science Fiction', 'Comedy', 'Action'],
    },
    {
      title: 'How to Train Your Dragon',
      poster: 'assets/how-to-train.jpg',
      rating: 7.988,
      genres: ['Fantasy', 'Action'],
    },
    {
      title: 'Candle in the Tomb: The Worm Valley',
      poster: 'assets/worm-valley.jpg',
      rating: 6.471,
      genres: ['Action', 'Adventure', 'Horror'],
    },
    {
      title: '28 Years Later',
      poster: 'assets/28-years.jpg',
      rating: 7.147,
      genres: ['Horror', 'Thriller', 'Science Fiction'],
    },
    {
      title: 'KPop Demon Hunters',
      poster: 'assets/kpop-demon.jpg',
      rating: 8.648,
      genres: ['Animation', 'Fantasy', 'Action', 'Comedy', 'Music'],
    },
    {
      title: 'Diablo',
      poster: 'assets/diablo.jpg',
      rating: 7.078,
      genres: ['Action', 'Thriller'],
    },
  ];

  ratingColor(rating: number): 'green' | 'orange' | 'red' {
    if (rating >= 7) return 'green';
    if (rating >= 5) return 'orange';
    return 'red';
  }
}
