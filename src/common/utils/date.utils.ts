// src/common/utils/date.utils.ts
import { BadRequestException } from '@nestjs/common';

export function parseDate(dateStr: string): Date {
  // ISO or YYYY-MM-DD / YYYY-MM-DDTHH:mm
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  // YYYY/MM/DD
  const slashMatch = dateStr.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (slashMatch) {
    const [, y, m, d] = slashMatch;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  // Unix timestamp (seconds or ms)
  if (/^\d+$/.test(dateStr)) {
    const timestamp = Number(dateStr);
    return new Date(dateStr.length === 10 ? timestamp * 1000 : timestamp);
  }

  throw new BadRequestException(
    'Invalid date format. Use YYYY-MM-DD or ISO format',
  );
}

/**
 * Returns a date range for a full day for filtering
 */
export function getDateRange(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;

  const start = new Date(dateObj);
  start.setHours(0, 0, 0, 0);

  const end = new Date(dateObj);
  end.setHours(23, 59, 59, 999);

  return { gte: start, lte: end };
}
