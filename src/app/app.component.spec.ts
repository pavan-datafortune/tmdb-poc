import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { TmdbAuthService } from '../core/auth/auth.service';
import { MoviesStore } from '../core/store/movies.store';

fdescribe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let mockRouterEvents: Subject<any>;
  let mockAuthService: jasmine.SpyObj<TmdbAuthService>;
  let mockMovieStore: jasmine.SpyObj<MoviesStore>;

  beforeEach(async () => {
    mockRouterEvents = new Subject<any>();

    mockAuthService = jasmine.createSpyObj(
      'TmdbAuthService',
      ['getAccountInfo'],
      { sessionId: 'mock-session' }
    );
    mockMovieStore = jasmine.createSpyObj('MoviesStore', ['']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: TmdbAuthService, useValue: mockAuthService },
        { provide: MoviesStore, useValue: mockMovieStore },
        {
          provide: Router,
          useValue: {
            events: mockRouterEvents.asObservable(),
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AppComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAccountInfo if sessionId exists', () => {
    expect(mockAuthService.getAccountInfo).toHaveBeenCalledWith('mock-session');
  });

  it('should set showLogout to true for non-login routes', () => {
    const navEnd = new NavigationEnd(1, '/movies', '/movies');
    mockRouterEvents.next(navEnd);
    expect(component.showLogout).toBeTrue();
  });

  it('should set showLogout to false for /login route', () => {
    const navEnd = new NavigationEnd(1, '/login', '/login');
    mockRouterEvents.next(navEnd);
    expect(component.showLogout).toBeFalse();
  });

  it('should navigate to /movies on gotoHomePage()', () => {
    component.gotoHomePage();
    const router = TestBed.inject(Router);
    expect(router.navigate).toHaveBeenCalledWith(['/movies']);
  });
});
