import { ScheduleEventDto } from '../dtos/request/schedule-event.dto';

export function createEvent(createLessonDto: ScheduleEventDto) {
  const lessonStartDateTime = `${createLessonDto.date}T${createLessonDto.startTime}:00-03:00`;
  const lessonEndDateTime = `${createLessonDto.date}T${createLessonDto.endTime}:00-03:00`;

  return {
    summary: createLessonDto.summary,
    description: createLessonDto.description,
    start: {
      dateTime: lessonStartDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: lessonEndDateTime,
      timeZone: 'America/Sao_Paulo',
    },
  };
}
