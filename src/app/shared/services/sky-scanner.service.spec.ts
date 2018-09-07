import { TestBed, inject } from '@angular/core/testing';

import { SkyScannerService } from './sky-skanner.service';

describe('SkyScannerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyScannerService]
    });
  });

  it('should be created', inject([SkyScannerService], (service: SkyScannerService) => {
    expect(service).toBeTruthy();
  }));
});
