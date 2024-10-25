import { TestBed } from '@angular/core/testing';

import { ConvoService } from './convo.service';

describe('ConvoService', () => {
  let service: ConvoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
