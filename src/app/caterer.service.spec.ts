import { TestBed } from '@angular/core/testing';

import { CatererService } from './caterer.service';

describe('CatererService', () => {
  let service: CatererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
