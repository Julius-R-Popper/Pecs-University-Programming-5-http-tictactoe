import { TestBed } from '@angular/core/testing';

import { ServerSocketService } from './server-socket-service';

describe('ServerSocketService', () => {
  let service: ServerSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
