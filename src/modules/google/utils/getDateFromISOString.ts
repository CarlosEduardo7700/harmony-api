export function getDateFromISOString(dateTime: string) {
  return dateTime.split('T')[0];
}
