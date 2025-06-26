import { TestBed } from '@angular/core/testing';
import { TmdbApiService } from './tmdb.http.service';

describe('TmdbApiService', () => {
  let service: TmdbApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmdbApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
