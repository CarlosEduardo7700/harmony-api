export function getTimeFromISOString(dateTime: string) {
  return dateTime.split('T')[1].split('-')[0].slice(0, -3);
}
