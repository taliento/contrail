import { inject, TestBed } from '@angular/core/testing';

import { AService } from './aservice.service';

describe('AServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AService],
    });
  });

  it('should be created', inject([AService], (service: AService) => {
    expect(service).toBeTruthy();
  }));
});
