import { TestBed } from '@angular/core/testing';

import { SharedFunAddService } from './shared-fun-add.service';

describe('SharedFunAddService', () => {
  let service: SharedFunAddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedFunAddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
