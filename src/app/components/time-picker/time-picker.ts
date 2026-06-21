import { Component, computed, input, output } from '@angular/core';

import type { AppLanguage } from '../../models/transaction-simulator.model';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.html',
  styleUrl: './time-picker.scss',
})
export class TimePicker {
  readonly language = input.required<AppLanguage>();
  readonly hour = input.required<number>();
  readonly minute = input.required<number>();

  readonly hourChange = output<number>();
  readonly minuteChange = output<number>();
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly title = computed(() =>
    this.language() === 'he' ? 'בחר שעה' : 'Enter time',
  );

  protected readonly hourLabel = computed(() =>
    this.language() === 'he' ? 'שעה' : 'Hour',
  );

  protected readonly minuteLabel = computed(() =>
    this.language() === 'he' ? 'דקה' : 'Minute',
  );

  protected readonly cancelLabel = computed(() =>
    this.language() === 'he' ? 'ביטול' : 'Cancel',
  );

  protected readonly confirmLabel = computed(() =>
    this.language() === 'he' ? 'אישור' : 'OK',
  );

  protected formatValue(value: number): string {
    return value.toString().padStart(2, '0');
  }

  protected onHourInput(value: string): void {
    const digits = value.replace(/\D/g, '');

    if (digits === '') {
      return;
    }

    const parsed = Number.parseInt(digits, 10);

    if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 23) {
      this.hourChange.emit(parsed);
    }
  }

  protected onMinuteInput(value: string): void {
    const digits = value.replace(/\D/g, '');

    if (digits === '') {
      return;
    }

    const parsed = Number.parseInt(digits, 10);

    if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 59) {
      this.minuteChange.emit(parsed);
    }
  }

  protected onHourBlur(input: HTMLInputElement): void {
    const clamped = this.clampValue(input.value, 0, 23);
    this.hourChange.emit(clamped);
    input.value = this.formatValue(clamped);
  }

  protected onMinuteBlur(input: HTMLInputElement): void {
    const clamped = this.clampValue(input.value, 0, 59);
    this.minuteChange.emit(clamped);
    input.value = this.formatValue(clamped);
  }

  private clampValue(value: string, min: number, max: number): number {
    const digits = value.replace(/\D/g, '');
    const parsed = Number.parseInt(digits, 10);

    if (Number.isNaN(parsed)) {
      return min;
    }

    return Math.min(max, Math.max(min, parsed));
  }
}
