import { CreateLessonDto } from 'src/modules/lesson/dtos/create-lesson.dto';

export function createEvent(createLessonDto: CreateLessonDto) {
  const lessonStartDateTime = `${createLessonDto.lessonDate}T${createLessonDto.startTime}:00-03:00`;
  const lessonEndDateTime = `${createLessonDto.lessonDate}T${createLessonDto.endTime}:00-03:00`;

  return {
    summary: createLessonDto.title,
    description: createLessonDto.observations,
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
