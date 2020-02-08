import { TestBed } from '@angular/core/testing';

import { WakeWordService } from './wake-word.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WakeWordService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: WakeWordService = TestBed.get(WakeWordService);
    expect(service).toBeTruthy();
  });
});
