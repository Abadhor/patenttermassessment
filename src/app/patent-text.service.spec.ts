import { TestBed, inject } from '@angular/core/testing';
import { PatentTextService } from './patent-text.service';

describe('PatentTextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatentTextService]
    });
  });

  it('should ...', inject([PatentTextService], (service: PatentTextService) => {
    expect(service).toBeTruthy();
  }));
});
