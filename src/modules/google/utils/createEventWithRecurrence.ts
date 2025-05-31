import { convertWeekdaysToRRULE } from './convertWeekdaysToRRULE';

interface RecurringEventData {
  summary: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  weekdays: string[];
  interval: number;
}

export function createEventWithRecurrence(data: RecurringEventData) {
  const {
    summary,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    weekdays,
    interval,
  } = data;

  const lessonStartDateTime = `${startDate}T${startTime}:00-03:00`;
  const lessonEndDateTime = `${startDate}T${endTime}:00-03:00`;
  const periodEndDate =
    new Date(`${endDate}T23:59:59-03:00`)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + 'Z';
  const weekdaysConverted = convertWeekdaysToRRULE(weekdays);

  return {
    summary: summary,
    description: description,
    start: {
      dateTime: lessonStartDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: lessonEndDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    recurrence: [
      `RRULE:FREQ=WEEKLY;BYDAY=${weekdaysConverted};INTERVAL=${interval};UNTIL=${periodEndDate}`,
    ],
  };
}
