import { TestBed } from '@angular/core/testing';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(JwtAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
