import { Routes } from '@angular/router';
import { MoviesPageComponent } from '../features/movies-list/movies.page';
import { LoginComponent } from '../features/login/login.component';
import { AuthGuard } from '../core/auth/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'movies', component: MoviesPageComponent, canActivate: [AuthGuard] },
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
      import('../features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('../features/login/callback.component').then(
        (m) => m.CallbackComponent
      ),
  },

  { path: '**', redirectTo: '' },
];
