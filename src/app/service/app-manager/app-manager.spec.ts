import { TestBed } from '@angular/core/testing';

import { AppManager } from './app-manager';

describe('AppManager', () => {
  let service: AppManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
