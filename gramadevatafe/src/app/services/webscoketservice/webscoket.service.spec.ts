import { TestBed } from '@angular/core/testing';

import { WebscoketService } from './webscoket.service';

describe('WebscoketService', () => {
  let service: WebscoketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebscoketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
