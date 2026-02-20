import { TestBed } from '@angular/core/testing';

import { TemplepriorityService } from './templepriority.service';

describe('TemplepriorityService', () => {
  let service: TemplepriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplepriorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
