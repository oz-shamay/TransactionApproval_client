export type AppLanguage = 'en' | 'he';

export interface TimeZoneOption {
  id: string;
  labelEn: string;
  labelHe: string;
}

export interface ApprovedTransaction {
  id: string;
  time: string;
  timeZoneId: string;
}

export interface ApprovedTransactionItemDto {
  id: number;
  timeZone: string;
  createdAtTime: string;
}

export interface ApprovedTransactionsPageDto {
  items: ApprovedTransactionItemDto[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export function toTimeZoneOptions(timeZones: string[]): TimeZoneOption[] {
  return timeZones.map((timeZone) => ({
    id: timeZone,
    labelEn: timeZone,
    labelHe: timeZone,
  }));
}
