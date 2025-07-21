import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieCardComponent } from './movie-card.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;

  const mockMovie = {
    id: 1,
    title: 'Inception',
    vote_average: 8.5,
    poster_path: '/abc.jpg',
    isFavorite: false,
    genres: [{ name: 'Action' }, { name: 'Sci-Fi' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    component.movie = mockMovie;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the movie title', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Inception');
  });

  it('should return correct rating color', () => {
    expect(component.ratingColor(8)).toBe('green');
    expect(component.ratingColor(6)).toBe('orange');
    expect(component.ratingColor(4)).toBe('red');
  });

  it('should emit favorite event on click', () => {
    spyOn(component.favorite, 'emit');
    const favoriteDiv = fixture.debugElement.query(By.css('.favorite'));
    favoriteDiv.triggerEventHandler('click');
    expect(component.favorite.emit).toHaveBeenCalledWith(mockMovie);
  });
});
