import { TestBed } from '@angular/core/testing';

import { SpeedTest } from './speed-test';

describe('SpeedTest', () => {
  let service: SpeedTest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeedTest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
