import { DateTime } from 'luxon';

export function convertUtcToBrIso(dateUtc: string) {
  const dateLocal = DateTime.fromISO(dateUtc, {
    zone: 'utc',
  })
    .setZone('America/Sao_Paulo')
    .toISO();

  return dateLocal;
}
