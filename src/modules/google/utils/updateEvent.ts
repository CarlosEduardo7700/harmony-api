/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UpdateLessonDto } from 'src/modules/lesson/dtos/update-lesson.dto';
import { getDateFromISOString } from './getDateFromISOString';
import { getTimeFromISOString } from './getTimeFromISOString';

export function updateEvent(updateLessonDto: UpdateLessonDto, lessonEvent) {
  const lessonData = {};
  const currentEventDate = getDateFromISOString(
    lessonEvent.data.start.dateTime,
  );
  const currentEventStartTime = getTimeFromISOString(
    lessonEvent.data.start.dateTime,
  );
  const currentEventEndTime = getTimeFromISOString(
    lessonEvent.data.end.dateTime,
  );

  if (updateLessonDto.title) {
    lessonData['summary'] = updateLessonDto.title;
  }

  if (updateLessonDto.observations) {
    lessonData['description'] = updateLessonDto.observations;
  }

  if (updateLessonDto.startTime || updateLessonDto.lessonDate) {
    lessonData['start'] = {
      dateTime: `${updateLessonDto.lessonDate ? updateLessonDto.lessonDate : currentEventDate}T${updateLessonDto.startTime ? updateLessonDto.startTime : currentEventStartTime}:00`,
      timeZone: 'America/Sao_Paulo',
    };
  }

  if (updateLessonDto.endTime || updateLessonDto.lessonDate) {
    lessonData['end'] = {
      dateTime: `${updateLessonDto.lessonDate ? updateLessonDto.lessonDate : currentEventDate}T${updateLessonDto.endTime ? updateLessonDto.endTime : currentEventEndTime}:00`,
      timeZone: 'America/Sao_Paulo',
    };
  }

  return {
    ...lessonData,
  };
}
