import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MoviesPageComponent } from './movies.page';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MockMoviesStore,
  Movie,
  MoviesStore,
} from '../../core/store/movies.store';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { of } from 'rxjs';

describe('MoviesPageComponent', () => {
  let fixture: ComponentFixture<MoviesPageComponent>;
  let component: MoviesPageComponent;
  const mockMovieStore = new MockMoviesStore();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MoviesPageComponent,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MovieCardComponent,
      ],
      providers: [
        { provide: MoviesStore, useValue: mockMovieStore },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
                if (key === 'movieId') return '123';
                return null;
              },
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load popular movies on init', () => {
    expect(mockMovieStore.loadMovies).toHaveBeenCalledWith('popular');
  });

  it('should render loaded movies in UI', () => {
    const mockMovies: Movie[] = [
      {
        name: 'Movie One',
        adult: false,
        backdrop_path: '/backdrop1.jpg',
        genres: [{ id: 1, name: 'Action' }],
        id: 101,
        original_language: 'en',
        original_title: 'Original Movie One',
        overview: 'This is the first mock movie.',
        popularity: 100.5,
        poster_path: '/poster1.jpg',
        release_date: '2023-01-01',
        title: 'Movie One',
        video: false,
        vote_average: 7.5,
        vote_count: 1500,
        isFavorite: false,
      },
      {
        name: 'Movie Two',
        adult: true,
        backdrop_path: '/backdrop2.jpg',
        genres: [{ id: 2, name: 'Drama' }],
        id: 102,
        original_language: 'fr',
        original_title: 'Original Movie Two',
        overview: 'This is the second mock movie.',
        popularity: 88.9,
        poster_path: '/poster2.jpg',
        release_date: '2023-05-10',
        title: 'Movie Two',
        video: false,
        vote_average: 8.2,
        vote_count: 980,
        isFavorite: true,
      },
    ];

    mockMovieStore.moviesList.set(mockMovies);

    fixture.detectChanges();

    const moviesCards = fixture.nativeElement.querySelectorAll('movie-card');

    expect(moviesCards.length).toBe(2);
  });

  it('should load movies when category changes', () => {
    const categoryControl = component.filterForm.get('category')!;
    categoryControl.setValue('top_rated');
    fixture.detectChanges();

    expect(mockMovieStore.loadMovies).toHaveBeenCalledWith('top_rated', 1, '');
  });

  it('should debounce and load movies on query change', fakeAsync(() => {
    const queryControl = component.filterForm.get('query')!;
    queryControl.setValue('Inception');

    tick(300);

    fixture.detectChanges();

    expect(mockMovieStore.loadMovies).toHaveBeenCalledWith(
      'popular',
      1,
      'Inception'
    );
  }));

  it('should load next page of movies', () => {
    mockMovieStore.currentPage.set(2);
    component.nextPage();

    expect(mockMovieStore.loadMovies).toHaveBeenCalledWith('popular', 3, '');
  });

  it('should load previous page if currentPage > 1', () => {
    mockMovieStore.currentPage.set(3);
    component.previousPage();

    expect(mockMovieStore.loadMovies).toHaveBeenCalledWith('popular', 2, '');
  });

  it('should not load previous page if currentPage = 1', () => {
    mockMovieStore.loadMovies.calls.reset();
    mockMovieStore.currentPage.set(1);

    component.previousPage();

    expect(mockMovieStore.loadMovies).not.toHaveBeenCalled();
  });
});
