import { CreateLessonsWithRecurrenceDto } from 'src/modules/lesson/dtos/request/schedule-recurring-lesson.dto';
import { convertWeekdaysToRRULE } from './convertWeekdaysToRRULE';
import { convertDateToRRuleUntil } from './convertDateToRRuleUntil';

export function createEventWithRecurrence(
  createLessonsDto: CreateLessonsWithRecurrenceDto,
) {
  const lessonStartDateTime = `${createLessonsDto.startDate}T${createLessonsDto.startTime}:00-03:00`;
  const lessonEndDateTime = `${createLessonsDto.startDate}T${createLessonsDto.endTime}:00-03:00`;
  const periodEndDate = convertDateToRRuleUntil(createLessonsDto.endDate);
  const weekdaysConverted = convertWeekdaysToRRULE(createLessonsDto.weekdays);

  return {
    summary: createLessonsDto.title,
    description: createLessonsDto.observations,
    start: {
      dateTime: lessonStartDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: lessonEndDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    recurrence: [
      `RRULE:FREQ=WEEKLY;BYDAY=${weekdaysConverted};INTERVAL=${createLessonsDto.recurrence};UNTIL=${periodEndDate}`,
    ],
  };
}
