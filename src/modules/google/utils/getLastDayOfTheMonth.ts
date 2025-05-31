export function getLastDayOfTheMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0, 23, 59, 59)).toISOString();
}
