import { convertWeekdaysToRRULE } from './convertWeekdaysToRRULE';
import { convertDateToRRuleUntil } from './convertDateToRRuleUntil';
import { ScheduleRecurringEventDto } from '../dtos/request/schedule-recurring-event.dto';

export function createEventWithRecurrence(dto: ScheduleRecurringEventDto) {
  const lessonStartDateTime = `${dto.startDate}T${dto.startTime}:00-03:00`;
  const lessonEndDateTime = `${dto.startDate}T${dto.endTime}:00-03:00`;
  const periodEndDate = convertDateToRRuleUntil(dto.endDate);
  const weekdaysConverted = convertWeekdaysToRRULE(dto.weekdays);

  return {
    summary: dto.summary,
    description: dto.description,
    start: {
      dateTime: lessonStartDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: lessonEndDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    recurrence: [
      `RRULE:FREQ=WEEKLY;BYDAY=${weekdaysConverted};INTERVAL=${dto.recurrence};UNTIL=${periodEndDate}`,
    ],
  };
}
