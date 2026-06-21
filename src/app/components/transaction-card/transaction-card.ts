import { Component, input } from '@angular/core';

import type { AppLanguage } from '../../models/transaction-simulator.model';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.html',
  styleUrl: './transaction-card.scss',
})
export class TransactionCard {
  readonly language = input.required<AppLanguage>();
  readonly time = input.required<string>();
  readonly timeZoneLabel = input.required<string>();
}
