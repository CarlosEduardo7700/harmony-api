import { CreateLessonDto } from '../dtos/request/create-lesson.dto';
import { Lesson } from '../lesson.entity';

export class LessonFactory {
  static createFromDto(
    data: CreateLessonDto,
    eventId: string,
    eventLink: string,
  ) {
    const lesson = new Lesson();

    lesson.title = data.title;
    lesson.startTime = data.startTime;
    lesson.endTime = data.endTime;
    lesson.lessonDate = new Date(data.lessonDate);
    lesson.observations = data.observations || '';
    lesson.googleEventId = eventId;
    lesson.googleEventLink = eventLink;
    lesson.createdAt = new Date().toISOString();
    lesson.updatedAt = new Date().toISOString();

    return lesson;
  }
}
