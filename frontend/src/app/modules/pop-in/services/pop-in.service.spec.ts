import { TestBed } from '@angular/core/testing';

import { PopInService } from './pop-in.service';

describe('PopInService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PopInService = TestBed.get(PopInService);
    expect(service).toBeTruthy();
  });
});
