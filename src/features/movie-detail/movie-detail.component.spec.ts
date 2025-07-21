import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailComponent } from './movie-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import {
  MockTmdbApiService,
  TmdbApiService,
} from '../../core/tmdb.http/tmdb.api.service';
import { MatDialog } from '@angular/material/dialog';
import { MockMoviesStore, MoviesStore } from '../../core/store/movies.store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockMovieStore = new MockMoviesStore();
  const mockTmdbApiService = new MockTmdbApiService();

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [MovieDetailComponent],
      providers: [
        { provide: TmdbApiService, useValue: mockTmdbApiService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MoviesStore, useValue: mockMovieStore },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'movieId' ? '123' : null),
            }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie details on init', () => {
    const mockMovie = {
      id: 123,
      title: 'Test Movie',
      credits: {},
      similar: {},
    };
    mockTmdbApiService.getMovieDetails.and.returnValue(of(mockMovie));
    mockTmdbApiService.getUserAccountStates.and.returnValue(
      of({ rated: { value: 8 } })
    );

    fixture.detectChanges();

    expect(component.movieDetails).toEqual(mockMovie);
    expect(component.userRating).toBe(8);
    expect(component.loading).toBeFalse();
  });

  it('should handle API error on movie details load', () => {
    mockTmdbApiService.getMovieDetails.and.returnValue(
      throwError(() => ({ status_message: 'Error' }))
    );

    fixture.detectChanges();

    expect(component.error).toBe('Error');
    expect(component.loading).toBeFalse();
  });

  it('should update ratedMovies on ratingChanged$', () => {
    const mockMovie = { id: 123, title: 'Movie', credits: {}, similar: {} };
    mockTmdbApiService.getMovieDetails.and.returnValue(of(mockMovie));
    mockTmdbApiService.getUserAccountStates.and.returnValue(
      of({ rated: { value: 7 } })
    );

    fixture.detectChanges();

    mockMovieStore.ratingChanged$.next({ movieId: 123, rating: 5 });

    fixture.detectChanges();

    expect(component.userRating).toBe(5);
    expect(component.ratedMovies[123]).toBe(5);
  });

  it('should open rating dialog', () => {
    const mockMovie = { id: 1, title: 'Test Movie' } as any;
    component.userRating = 6;
    component.openRatingDialog(mockMovie);

    expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: {
        movieId: 1,
        title: 'Test Movie',
        currentRating: 6,
      },
    });
  });

  it('should toggle showAllCast', () => {
    expect(component.showAllCast).toBeFalse();
    component.toggleCast();
    expect(component.showAllCast).toBeTrue();
  });

  it('should toggle showRecommendations', () => {
    expect(component.showRecommendations).toBeFalse();
    component.toggleRecommendationList();
    expect(component.showRecommendations).toBeTrue();
  });

  it('castWithPhotos should return filtered cast list', () => {
    component.movieDetails = {
      credits: {
        cast: [
          { name: 'Actor 1', profile_path: 'path1' },
          { name: 'Actor 2', profile_path: null },
        ],
      },
    };

    expect(component.castWithPhotos.length).toBe(1);
    expect(component.castWithPhotos[0].name).toBe('Actor 1');
  });

  it('recommendationList should return filtered similar movies', () => {
    component.movieDetails = {
      similar: {
        results: [
          { title: 'Movie A', poster_path: 'posterA' },
          { title: 'Movie B', poster_path: null },
        ],
      },
    };

    expect(component.recommendationList.length).toBe(1);
    expect(component.recommendationList[0].title).toBe('Movie A');
  });
});
