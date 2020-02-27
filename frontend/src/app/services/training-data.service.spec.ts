import { TestBed } from '@angular/core/testing';

import { TrainingDataService } from './training-data.service';

describe('TrainingDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingDataService = TestBed.get(TrainingDataService);
    expect(service).toBeTruthy();
  });
});
