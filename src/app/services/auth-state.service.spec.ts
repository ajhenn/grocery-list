import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-state.service';

describe('AuthStateService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
