import { TestBed, inject } from '@angular/core/testing';
import { AssessmentGuardService } from './assessment-guard.service';

describe('AssessmentGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentGuardService]
    });
  });

  it('should ...', inject([AssessmentGuardService], (service: AssessmentGuardService) => {
    expect(service).toBeTruthy();
  }));
});
