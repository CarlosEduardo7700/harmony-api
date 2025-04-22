export function convertWeekdaysToRRULE(weekdays: string[]) {
  const weekdaysToRRULE: Record<string, string> = {
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR',
    Saturday: 'SA',
    Sunday: 'SU',
  };

  const weekdaysConverted = weekdays
    .map((day) => weekdaysToRRULE[day])
    .join(',');

  return weekdaysConverted;
}
