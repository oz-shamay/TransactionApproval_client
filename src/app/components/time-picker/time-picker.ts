import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import type { AppLanguage } from '../../models/transaction-simulator.model';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.html',
  styleUrl: './time-picker.scss',
})
export class TimePicker {
  private static readonly INPUT_DEBOUNCE_MS = 600;

  readonly language = input.required<AppLanguage>();
  readonly hour = input<number | null>(null);
  readonly minute = input<number | null>(null);

  readonly hourChange = output<number | null>();
  readonly minuteChange = output<number | null>();
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly hourDraft = signal('');
  protected readonly minuteDraft = signal('');

  private hourDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private minuteDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly destroyRef = inject(DestroyRef);

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

  constructor() {
    effect(() => {
      this.hourDraft.set(this.formatValue(this.hour()));
    });

    effect(() => {
      this.minuteDraft.set(this.formatValue(this.minute()));
    });

    this.destroyRef.onDestroy(() => {
      this.clearHourDebounce();
      this.clearMinuteDebounce();
    });
  }

  protected formatValue(value: number | null): string {
    if (value === null) {
      return '';
    }

    return value.toString().padStart(2, '0');
  }

  protected onHourInput(value: string): void {
    const digits = value.replace(/\D/g, '');
    this.hourDraft.set(digits);
    this.scheduleHourCommit(digits);
  }

  protected onMinuteInput(value: string): void {
    const digits = value.replace(/\D/g, '');
    this.minuteDraft.set(digits);
    this.scheduleMinuteCommit(digits);
  }

  protected onHourBlur(input: HTMLInputElement): void {
    this.clearHourDebounce();
    const digits = input.value.replace(/\D/g, '');

    if (digits === '') {
      this.commitHour(null);
      this.hourDraft.set('');
      return;
    }

    const clamped = this.clampValue(digits, 0, 23);
    this.commitHour(clamped);
    this.hourDraft.set(this.formatValue(clamped));
  }

  protected onMinuteBlur(input: HTMLInputElement): void {
    this.clearMinuteDebounce();
    const digits = input.value.replace(/\D/g, '');

    if (digits === '') {
      this.commitMinute(null);
      this.minuteDraft.set('');
      return;
    }

    const clamped = this.clampValue(digits, 0, 59);
    this.commitMinute(clamped);
    this.minuteDraft.set(this.formatValue(clamped));
  }

  private scheduleHourCommit(digits: string): void {
    this.clearHourDebounce();
    this.hourDebounceTimer = setTimeout(() => {
      this.hourDebounceTimer = null;

      if (digits === '') {
        this.commitHour(null);
        return;
      }

      const parsed = Number.parseInt(digits, 10);

      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 23) {
        this.commitHour(parsed);
      }
    }, TimePicker.INPUT_DEBOUNCE_MS);
  }

  private scheduleMinuteCommit(digits: string): void {
    this.clearMinuteDebounce();
    this.minuteDebounceTimer = setTimeout(() => {
      this.minuteDebounceTimer = null;

      if (digits === '') {
        this.commitMinute(null);
        return;
      }

      const parsed = Number.parseInt(digits, 10);

      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 59) {
        this.commitMinute(parsed);
      }
    }, TimePicker.INPUT_DEBOUNCE_MS);
  }

  private commitHour(value: number | null): void {
    this.hourChange.emit(value);
  }

  private commitMinute(value: number | null): void {
    this.minuteChange.emit(value);
  }

  private clearHourDebounce(): void {
    if (this.hourDebounceTimer !== null) {
      clearTimeout(this.hourDebounceTimer);
      this.hourDebounceTimer = null;
    }
  }

  private clearMinuteDebounce(): void {
    if (this.minuteDebounceTimer !== null) {
      clearTimeout(this.minuteDebounceTimer);
      this.minuteDebounceTimer = null;
    }
  }

  private clampValue(value: string, min: number, max: number): number {
    const parsed = Number.parseInt(value, 10);

    if (Number.isNaN(parsed)) {
      return min;
    }

    return Math.min(max, Math.max(min, parsed));
  }
}
