/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PatentTermsService } from './patent-terms.service';

describe('PatentTermsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatentTermsService]
    });
  });

  it('should ...', inject([PatentTermsService], (service: PatentTermsService) => {
    expect(service).toBeTruthy();
  }));
});
