import { Component, input, output } from '@angular/core';

import type { AppLanguage } from '../../models/transaction-simulator.model';

@Component({
  selector: 'app-language-toggle',
  templateUrl: './language-toggle.html',
  styleUrl: './language-toggle.scss',
})
export class LanguageToggle {
  readonly language = input.required<AppLanguage>();
  readonly languageChange = output<AppLanguage>();

  selectLanguage(nextLanguage: AppLanguage): void {
    if (nextLanguage !== this.language()) {
      this.languageChange.emit(nextLanguage);
    }
  }
}
