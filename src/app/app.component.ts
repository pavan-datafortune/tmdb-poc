import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MoviesStore } from '../features/movies-list/movies.store';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TmdbAuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  auth = inject(TmdbAuthService);
  router = inject(Router);
  movieStore = inject(MoviesStore);

  showLogout = false;

  ngOnInit() {
    this.auth.getAccountInfo(this.auth.sessionId);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showLogout = event.urlAfterRedirects !== '/login';
      });
  }
}
