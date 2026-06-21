import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import type {
  ApprovedTransaction,
  ApprovedTransactionItemDto,
  ApprovedTransactionsPageDto,
} from '../models/transaction-simulator.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly api = inject(ApiService);

  getTimeZones(): Observable<string[]> {
    return this.api.get<string[]>('Transactions/timezones');
  }

  getApprovedTransactions(
    timeZone: string,
    createdAtTime: string,
  ): Observable<ApprovedTransaction[]> {
    return this.api
      .get<ApprovedTransactionsPageDto>('Transactions/approved', {
        params: {
          TimeZone: timeZone,
          CreatedAtTime: createdAtTime,
        },
      })
      .pipe(
        map((page) =>
          page.items.map((item) => this.toApprovedTransaction(item)),
        ),
      );
  }

  private toApprovedTransaction(
    item: ApprovedTransactionItemDto,
  ): ApprovedTransaction {
    return {
      id: String(item.id),
      time: this.formatCreatedAtTime(item.createdAtTime, item.timeZone),
      timeZoneId: item.timeZone,
    };
  }

  private formatCreatedAtTime(isoDateTime: string, timeZoneId: string): string {
    const utcDate = this.parseUtcDateTime(isoDateTime);
    if (!utcDate) {
      return isoDateTime;
    }

    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: timeZoneId,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(utcDate);
    } catch {
      return isoDateTime;
    }
  }

  private parseUtcDateTime(isoDateTime: string): Date | null {
    const normalized = isoDateTime.endsWith('Z')
      ? isoDateTime
      : `${isoDateTime}Z`;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
