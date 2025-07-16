import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RateMovieDialog } from './rate.movie-dialog.component';

describe('RateMovieDialog', () => {
  let component: RateMovieDialog;
  let fixture: ComponentFixture<RateMovieDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateMovieDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RateMovieDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
