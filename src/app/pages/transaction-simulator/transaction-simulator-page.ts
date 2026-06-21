import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';

import { ApprovedTransactions } from '../../components/approved-transactions/approved-transactions';
import { Header } from '../../components/header/header';
import { PromoPanel } from '../../components/promo-panel/promo-panel';
import { SearchAutocomplete } from '../../components/search-autocomplete/search-autocomplete';
import { TimePicker } from '../../components/time-picker/time-picker';
import type {
  AppLanguage,
  ApprovedTransaction,
  TimeZoneOption,
} from '../../models/transaction-simulator.model';
import { toTimeZoneOptions } from '../../models/transaction-simulator.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-simulator-page',
  imports: [
    Header,
    SearchAutocomplete,
    TimePicker,
    PromoPanel,
    ApprovedTransactions,
  ],
  templateUrl: './transaction-simulator-page.html',
  styleUrl: './transaction-simulator-page.scss',
})
export class TransactionSimulatorPage {
  private readonly document = inject(DOCUMENT);
  private readonly transactionService = inject(TransactionService);

  protected readonly language = signal<AppLanguage>('en');
  protected readonly selectedTimeZoneId = signal<string | null>(null);
  protected readonly hour = signal<number | null>(null);
  protected readonly minute = signal<number | null>(null);
  protected readonly timeZoneOptions = signal<TimeZoneOption[]>([]);
  protected readonly approvedTransactions = signal<ApprovedTransaction[]>([]);

  protected readonly badgeLabel = computed(() =>
    this.language() === 'he' ? 'סימולטור עסקאות' : 'TRANSACTION SIMULATOR',
  );

  protected readonly pageTitle = computed(() =>
    this.language() === 'he'
      ? 'האם העסקה הזו תאושר?'
      : 'Will this transaction be approved?',
  );

  constructor() {
    effect(() => {
      const currentLanguage = this.language();
      const htmlElement = this.document.documentElement;

      htmlElement.lang = currentLanguage;
      htmlElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr';
    });

  }

  ngOnInit(): void {
    this.loadTimeZones();
  }

  protected setLanguage(language: AppLanguage): void {
    this.language.set(language);
  }

  protected setSelectedTimeZoneId(timeZoneId: string | null): void {
    this.selectedTimeZoneId.set(timeZoneId);
  }

  protected setHour(hour: number | null): void {
    this.hour.set(hour);
  }

  protected setMinute(minute: number | null): void {
    this.minute.set(minute);
  }

  protected submitSelection(): void {
    const timeZone = this.selectedTimeZoneId();

    if (!timeZone) {
      return;
    }

    const hour = this.hour();
    const minute = this.minute();
    const createdAtTime =
      hour !== null && minute !== null
        ? this.formatTime(hour, minute)
        : null;

    this.transactionService
      .getApprovedTransactions(timeZone, createdAtTime)
      .subscribe({
        next: (transactions) => this.approvedTransactions.set(transactions),
      });
  }

  private loadTimeZones(): void {
    this.transactionService.getTimeZones().subscribe({
      next: (timeZones) => {
        this.timeZoneOptions.set(toTimeZoneOptions(timeZones));

        if (timeZones.length > 0 && !this.selectedTimeZoneId()) {
          this.selectedTimeZoneId.set(timeZones[0]);
        }
      },
    });
  }

  private formatTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
}
