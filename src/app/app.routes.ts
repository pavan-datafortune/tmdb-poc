import { Routes } from '@angular/router';
import { MoviesPageComponent } from '../features/movies-list/movies.page';
import { AuthGuard } from '../core/auth/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'movies',
    loadComponent: () =>
      import('../features/movies-list/movies.page').then(
        (comp) => comp.MoviesPageComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'movie-detail/:movieId',
    loadComponent: () =>
      import('../features/movie-detail/pages/movie-detail.component').then(
        (comp) => comp.MovieDetailComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'login',
    loadComponent: () =>
      import('../features/login/login.component').then(
        (comp) => comp.LoginComponent
      ),
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('../features/login/callback.component').then(
        (comp) => comp.CallbackComponent
      ),
  },

  { path: '**', redirectTo: '' },
];
