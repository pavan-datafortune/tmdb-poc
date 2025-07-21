import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RateMovieDialog } from './rate.movie-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MockTmdbApiService,
  TmdbApiService,
} from '../../../core/tmdb.http/tmdb.api.service';
import { MockMoviesStore, MoviesStore } from '../../../core/store/movies.store';
import { of } from 'rxjs';

describe('RateMovieDialog', () => {
  let component: RateMovieDialog;
  let fixture: ComponentFixture<RateMovieDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<RateMovieDialog>>;

  const mockTmdbApiService = new MockTmdbApiService();
  const mockMovieStore = new MockMoviesStore();

  const mockDialogData = {
    movieId: 1,
    title: 'Sample Movie',
    currentRating: 7.5,
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [RateMovieDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: TmdbApiService, useValue: mockTmdbApiService },
        { provide: MoviesStore, useValue: mockMovieStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RateMovieDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with given rating and show delete button if rating > 0', () => {
    expect(component.value).toBe(7.5);
    expect(component.showDeleteButton).toBeTrue();
  });

  it('should call rateMovie and close dialog on submit()', () => {
    mockTmdbApiService.rateMovie.and.returnValue(of({}));

    component.submit();

    expect(mockTmdbApiService.rateMovie).toHaveBeenCalledWith(
      mockDialogData.movieId,
      component.value
    );
    expect(mockMovieStore.emitRatingChange).toHaveBeenCalledWith(
      mockDialogData.movieId,
      component.value
    );
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call removeRating and close dialog on remove()', () => {
    mockTmdbApiService.removeRating.and.returnValue(of({}));

    component.remove();

    expect(mockTmdbApiService.removeRating).toHaveBeenCalledWith(
      mockDialogData.movieId
    );
    expect(mockMovieStore.emitRatingChange).toHaveBeenCalledWith(
      mockDialogData.movieId,
      null
    );
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog on close()', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
