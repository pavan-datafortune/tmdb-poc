import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'movie-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css',
})
export class MovieCardComponent {
  @Input() movie: any;

  @Output() favorite = new EventEmitter<number>();

  ratingColor(rating: number): 'green' | 'orange' | 'red' {
    if (rating >= 7) return 'green';
    if (rating >= 5) return 'orange';
    return 'red';
  }
}
