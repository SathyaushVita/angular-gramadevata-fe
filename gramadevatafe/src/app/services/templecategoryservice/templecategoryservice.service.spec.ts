import { TestBed } from '@angular/core/testing';

import { TemplecategoryserviceService } from './templecategoryservice.service';

describe('TemplecategoryserviceService', () => {
  let service: TemplecategoryserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplecategoryserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
