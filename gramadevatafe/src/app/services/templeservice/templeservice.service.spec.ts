import { TestBed } from '@angular/core/testing';

import { TempleserviceService } from './templeservice.service';

describe('TempleserviceService', () => {
  let service: TempleserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempleserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
