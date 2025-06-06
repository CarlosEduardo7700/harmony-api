export function convertDateToRRuleUntil(date: string) {
  const convertedDate =
    new Date(`${date}T23:59:59-03:00`)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + 'Z';

  return convertedDate;
}
