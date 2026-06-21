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
      .subscribe((page) => {
        expect(page).toEqual({
          items: [
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
          ],
          page: 0,
          pageSize: 20,
          totalCount: 2,
        });
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

    service.getApprovedTransactions('Europe/London').subscribe((page) => {
      expect(page).toEqual({
        items: [
          {
            id: '2',
            time: '18:45',
            timeZoneId: 'Europe/London',
          },
        ],
        page: 0,
        pageSize: 20,
        totalCount: 1,
      });
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

  it('should fetch approved transactions with page param', () => {
    const mockResponse = {
      items: [
        {
          id: 22,
          timeZone: 'Europe/London',
          createdAtTime: '2026-06-20T17:45:08.0545231',
        },
      ],
      page: 1,
      pageSize: 20,
      totalCount: 21,
    };

    service
      .getApprovedTransactions('Europe/London', '09:01', 1)
      .subscribe((page) => {
        expect(page.page).toBe(1);
        expect(page.items).toHaveLength(1);
        expect(page.totalCount).toBe(21);
      });

    const request = httpMock.expectOne((req) => {
      return (
        req.url === 'https://localhost:44385/Transactions/approved' &&
        req.params.get('TimeZone') === 'Europe/London' &&
        req.params.get('CreatedAtTime') === '09:01' &&
        req.params.get('Page') === '1'
      );
    });
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});
