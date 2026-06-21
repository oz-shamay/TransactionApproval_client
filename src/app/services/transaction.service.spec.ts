import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch timezones', () => {
    const mockTimeZones = ['Europe/London', 'Asia/Jerusalem'];

    service.getTimeZones().subscribe((timeZones) => {
      expect(timeZones).toEqual(mockTimeZones);
    });

    const request = httpMock.expectOne(
      'https://localhost:44385/Transactions/timezones',
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockTimeZones);
  });

  it('should fetch approved transactions with query params', () => {
    const mockResponse = {
      items: [
        {
          id: 2,
          timeZone: 'Europe/London',
          createdAtTime: '2026-06-20T17:45:08.0545231',
        },
        {
          id: 3,
          timeZone: 'Asia/Jerusalem',
          createdAtTime: '2026-06-20T17:45:08.0545231',
        },
      ],
      page: 0,
      pageSize: 20,
      totalCount: 2,
    };

    service
      .getApprovedTransactions('Europe/London', '09:01')
      .subscribe((transactions) => {
        expect(transactions).toEqual([
          {
            id: '2',
            time: '18:45',
            timeZoneId: 'Europe/London',
          },
          {
            id: '3',
            time: '20:45',
            timeZoneId: 'Asia/Jerusalem',
          },
        ]);
      });

    const request = httpMock.expectOne((req) => {
      return (
        req.url === 'https://localhost:44385/Transactions/approved' &&
        req.params.get('TimeZone') === 'Europe/London' &&
        req.params.get('CreatedAtTime') === '09:01'
      );
    });
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should fetch approved transactions with timezone only', () => {
    const mockResponse = {
      items: [
        {
          id: 2,
          timeZone: 'Europe/London',
          createdAtTime: '2026-06-20T17:45:08.0545231',
        },
      ],
      page: 0,
      pageSize: 20,
      totalCount: 1,
    };

    service.getApprovedTransactions('Europe/London').subscribe((transactions) => {
      expect(transactions).toEqual([
        {
          id: '2',
          time: '18:45',
          timeZoneId: 'Europe/London',
        },
      ]);
    });

    const request = httpMock.expectOne((req) => {
      return (
        req.url === 'https://localhost:44385/Transactions/approved' &&
        req.params.get('TimeZone') === 'Europe/London' &&
        req.params.get('CreatedAtTime') === null
      );
    });
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});
