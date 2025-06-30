import { Routes } from '@angular/router';
import { MovieCardsComponent } from '../features/home/pages/home.page';

export const appRoutes: Routes = [
  { path: 'home', component: MovieCardsComponent },
  {
    path: 'movie-detail/:movieId',
    loadComponent: () =>
      import('../features/movie-detail/pages/movie-detail.component').then(
        (comp) => comp.MovieDetailComponent
      ),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
