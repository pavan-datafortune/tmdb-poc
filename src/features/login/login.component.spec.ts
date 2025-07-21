import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {
  MockTmdbAuthService,
  TmdbAuthService,
} from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const authService = new MockTmdbAuthService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, CommonModule],
      providers: [{ provide: TmdbAuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TmdbAuthService', () => {
    expect(component.auth).toBeTruthy();
    expect(component.auth).toBe(authService);
  });
});
