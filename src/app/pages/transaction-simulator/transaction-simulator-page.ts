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

const TIME_ZONE_OPTIONS: TimeZoneOption[] = [
  { id: 'france', labelEn: 'France', labelHe: 'צרפת' },
  { id: 'israel', labelEn: 'Israel', labelHe: 'ישראל' },
  { id: 'cyprus', labelEn: 'Cyprus', labelHe: 'קפריסין' },
  { id: 'italy', labelEn: 'Italy', labelHe: 'איטליה' },
];

const APPROVED_TRANSACTIONS: ApprovedTransaction[] = [
  { id: '1', time: '14:24', timeZoneId: 'france' },
  { id: '2', time: '14:24', timeZoneId: 'france' },
  { id: '3', time: '14:24', timeZoneId: 'france' },
  { id: '4', time: '14:24', timeZoneId: 'france' },
  { id: '5', time: '14:24', timeZoneId: 'france' },
  { id: '6', time: '14:24', timeZoneId: 'france' },
];

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

  protected readonly language = signal<AppLanguage>('en');
  protected readonly selectedTimeZoneId = signal<string | null>('france');
  protected readonly hour = signal(20);
  protected readonly minute = signal(0);

  protected readonly timeZoneOptions = TIME_ZONE_OPTIONS;
  protected readonly approvedTransactions = APPROVED_TRANSACTIONS;

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

  protected setLanguage(language: AppLanguage): void {
    this.language.set(language);
  }

  protected setSelectedTimeZoneId(timeZoneId: string | null): void {
    this.selectedTimeZoneId.set(timeZoneId);
  }

  protected setHour(hour: number): void {
    this.hour.set(hour);
  }

  protected setMinute(minute: number): void {
    this.minute.set(minute);
  }
}
