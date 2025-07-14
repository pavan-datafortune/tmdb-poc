import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMovieDailogComponent } from './rate.movie-dialog.component';

describe('RateMovieDailogComponent', () => {
  let component: RateMovieDailogComponent;
  let fixture: ComponentFixture<RateMovieDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateMovieDailogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateMovieDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
