import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET requests against the configured apiUrl', () => {
    const mockResponse = [{ id: '1' }];

    service.get<typeof mockResponse>('api/example').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(
      'https://localhost:44385/api/example',
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should normalize paths with a leading slash', () => {
    service.get('transactions').subscribe();

    const request = httpMock.expectOne('https://localhost:44385/transactions');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('should perform POST requests with a body', () => {
    const body = { timeZoneId: 'france' };
    const mockResponse = { id: '1', ...body };

    service.post<typeof mockResponse>('transactions', body).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpMock.expectOne('https://localhost:44385/transactions');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush(mockResponse);
  });
});
