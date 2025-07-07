import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../core/favorites/favorites.service';

@Component({
  standalone: true,
  selector: 'app-favorites',
  imports: [CommonModule],
  template: `
    <h2 style="margin:1rem 0">My Favorite Movies</h2>
    <div class="grid">
      <div class="card" *ngFor="let m of movies">
        <img [src]="'https://image.tmdb.org/t/p/w185' + m.poster_path" />
        <p>{{ m.title }}</p>
        <button (click)="toggle(m.id)">Remove</button>
      </div>
    </div>
  `,
  styles: [
    `
      .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .card {
        width: 185px;
        text-align: center;
      }
      img {
        width: 100%;
        border-radius: 6px;
      }
    `,
  ],
})
export class FavoritesComponent implements OnInit {
  private favSvc = inject(FavoritesService);
  movies: any[] = [];

  ngOnInit() {
    this.refresh();
  }
  refresh() {
    this.favSvc.getFavorites().subscribe((list) => (this.movies = list));
  }
  toggle(id: number) {
    this.favSvc.markFavorite(id, false).subscribe(() => this.refresh());
  }
}
