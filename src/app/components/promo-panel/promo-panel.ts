import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import type { AppLanguage } from '../../models/transaction-simulator.model';

@Component({
  selector: 'app-promo-panel',
  imports: [NgOptimizedImage],
  templateUrl: './promo-panel.html',
  styleUrl: './promo-panel.scss',
})
export class PromoPanel {
  readonly language = input.required<AppLanguage>();

  protected readonly headline = computed(() =>
    this.language() === 'he'
      ? 'מערכת הבטוחה, היציבה והמתקדמת בישראל'
      : 'The secure, stable, and advanced system in Israel',
  );

  protected readonly body = computed(() =>
    this.language() === 'he'
      ? 'שב"א מספקת תשתית אשראי מתקדמת לעסקים, בנקים וגופים פיננסיים — עם ממשק נוח, מהיר ומאובטח.'
      : 'Shva provides advanced credit infrastructure for businesses, banks, and financial institutions — with a convenient, fast, and secure interface.',
  );
}
