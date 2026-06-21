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
