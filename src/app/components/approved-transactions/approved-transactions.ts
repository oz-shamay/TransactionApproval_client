import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, computed, input, viewChild } from '@angular/core';

import { TransactionCard } from '../transaction-card/transaction-card';
import type { AppLanguage, ApprovedTransaction, TimeZoneOption } from '../../models/transaction-simulator.model';

@Component({
  selector: 'app-approved-transactions',
  imports: [TransactionCard, NgOptimizedImage],
  templateUrl: './approved-transactions.html',
  styleUrl: './approved-transactions.scss',
})
export class ApprovedTransactions {
  readonly language = input.required<AppLanguage>();
  readonly transactions = input.required<ApprovedTransaction[]>();
  readonly timeZoneOptions = input.required<TimeZoneOption[]>();

  private readonly carousel = viewChild<ElementRef<HTMLElement>>('carousel');

  protected readonly title = computed(() =>
    this.language() === 'he' ? 'עסקאות מאושרות' : 'Approved Transactions',
  );

  protected readonly previousLabel = computed(() =>
    this.language() === 'he' ? 'עסקה קודמת' : 'Previous transaction',
  );

  protected readonly nextLabel = computed(() =>
    this.language() === 'he' ? 'עסקה הבאה' : 'Next transaction',
  );

  protected timeZoneLabel(timeZoneId: string): string {
    const option = this.timeZoneOptions().find((item) => item.id === timeZoneId);

    if (!option) {
      return timeZoneId;
    }

    return this.language() === 'he' ? option.labelHe : option.labelEn;
  }

  protected scrollPrevious(): void {
    this.carousel()?.nativeElement.scrollBy({ left: -180, behavior: 'smooth' });
  }

  protected scrollNext(): void {
    this.carousel()?.nativeElement.scrollBy({ left: 180, behavior: 'smooth' });
  }
}
