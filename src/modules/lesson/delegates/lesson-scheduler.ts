/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { GoogleCalendarService } from 'src/modules/google/google-calendar.service';
import { CreateLessonDto } from '../dtos/request/create-lesson.dto';
import { LessonFactory } from '../factories/lessonFactory';
import { CreateLessonsWithRecurrenceDto } from '../dtos/request/create-lessons-with-recurrence.dto';
import { ScheduleRecurringLessonResponseDto } from '../dtos/response/schedule-lesson-recurrence-response.dto';
import { LessonDetailDto } from '../dtos/response/lesson-detail.dto';

export class LessonScheduler {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async scheduleLesson(dto: CreateLessonDto): Promise<LessonDetailDto> {
    const googleCalendarResponse =
      await this.googleCalendarService.scheduleLesson(dto);

    const lessonCreated = LessonFactory.createFromDto(
      dto,
      googleCalendarResponse.eventId,
      googleCalendarResponse.eventLink,
    );

    const databaseResponse = await this.lessonRepository.save(lessonCreated);

    return {
      id: databaseResponse.id,
      title: databaseResponse.title,
      lessonDate: databaseResponse.lessonDate,
      startTime: databaseResponse.startTime,
      endTime: databaseResponse.endTime,
      observations: databaseResponse.observations,
      googleEventId: databaseResponse.googleEventId,
      googleEventLink: databaseResponse.googleEventLink,
    };
  }

  async scheduleLessonsWithRecurrence(
    dto: CreateLessonsWithRecurrenceDto,
  ): Promise<ScheduleRecurringLessonResponseDto> {
    const googleCalendarResponse =
      await this.googleCalendarService.scheduleLessonsWithRecurrence(dto);

    for (const lesson of googleCalendarResponse) {
      await this.scheduleLesson(lesson);
    }

    return {
      recurringEventId: googleCalendarResponse[0].recurringEventId,
      title: googleCalendarResponse[0].title,
      observations: googleCalendarResponse[0].observations,
      startTime: googleCalendarResponse[0].startTime,
      endTime: googleCalendarResponse[0].endTime,
    };
  }
}
