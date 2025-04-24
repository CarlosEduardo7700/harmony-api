export function getFirstDayOfTheMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month - 1, 1)).toISOString();
}
