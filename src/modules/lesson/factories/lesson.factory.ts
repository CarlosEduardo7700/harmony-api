import { ScheduleLessonDto } from '../dtos/request/schedule-lesson.dto';
import { Lesson } from '../lesson.entity';

export class LessonFactory {
  static createFromDto(
    dto: ScheduleLessonDto,
    eventId: string,
    eventLink: string,
  ) {
    const lesson = new Lesson();

    lesson.title = dto.title;
    lesson.startTime = dto.startTime;
    lesson.endTime = dto.endTime;
    lesson.lessonDate = new Date(dto.lessonDate);
    lesson.observations = dto.observations || '';
    lesson.googleEventId = eventId;
    lesson.googleEventLink = eventLink;
    lesson.createdAt = new Date().toISOString();
    lesson.updatedAt = new Date().toISOString();

    return lesson;
  }
}
