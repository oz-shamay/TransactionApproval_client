import { NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { LanguageToggle } from '../language-toggle/language-toggle';
import type { AppLanguage } from '../../models/transaction-simulator.model';

@Component({
  selector: 'app-header',
  imports: [LanguageToggle, NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly language = input.required<AppLanguage>();
  readonly languageChange = output<AppLanguage>();
}
