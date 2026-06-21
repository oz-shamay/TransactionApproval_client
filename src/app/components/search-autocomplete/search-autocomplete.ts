import { Component, computed, input, output, signal } from '@angular/core';

import type { AppLanguage, TimeZoneOption } from '../../models/transaction-simulator.model';

@Component({
  selector: 'app-search-autocomplete',
  templateUrl: './search-autocomplete.html',
  styleUrl: './search-autocomplete.scss',
})
export class SearchAutocomplete {
  readonly language = input.required<AppLanguage>();
  readonly options = input.required<TimeZoneOption[]>();
  readonly selectedOptionId = input<string | null>(null);

  readonly selectedOptionIdChange = output<string | null>();
  readonly queryChange = output<string>();

  protected readonly query = signal('');
  protected readonly isOpen = signal(false);

  protected readonly label = computed(() =>
    this.language() === 'he' ? 'תווית' : 'Label',
  );

  protected readonly placeholder = computed(() =>
    this.language() === 'he' ? 'חיפוש' : 'search',
  );

  protected readonly filteredOptions = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();

    if (!normalizedQuery) {
      return this.options();
    }

    return this.options().filter((option) => {
      const label =
        this.language() === 'he' ? option.labelHe : option.labelEn;
      return label.toLowerCase().includes(normalizedQuery);
    });
  });

  protected optionLabel(option: TimeZoneOption): string {
    return this.language() === 'he' ? option.labelHe : option.labelEn;
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.isOpen.set(true);
    this.queryChange.emit(value);
  }

  protected openDropdown(): void {
    this.isOpen.set(true);
  }

  protected selectOption(option: TimeZoneOption): void {
    this.query.set(this.optionLabel(option));
    this.selectedOptionIdChange.emit(option.id);
    this.closeDropdown();
  }

  protected clearSelection(): void {
    this.query.set('');
    this.selectedOptionIdChange.emit(null);
    this.closeDropdown();
  }

  protected closeDropdown(): void {
    this.isOpen.set(false);
  }
}
