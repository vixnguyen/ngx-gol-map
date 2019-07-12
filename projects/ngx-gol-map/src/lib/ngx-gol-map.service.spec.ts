import { TestBed } from '@angular/core/testing';

import { NgxGolMapService } from './ngx-gol-map.service';

describe('NgxGolMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxGolMapService = TestBed.get(NgxGolMapService);
    expect(service).toBeTruthy();
  });
});
