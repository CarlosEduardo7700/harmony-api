import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { GoogleCalendarService } from 'src/modules/google/google-calendar.service';
import { LessonFactory } from '../factories/lesson.factory';
import { ScheduleRecurringLessonResponseDto } from '../dtos/response/schedule-recurring-lesson-response.dto';
import { LessonDetailDto } from '../dtos/response/lesson-detail.dto';
import { ScheduleLessonDto } from '../dtos/request/schedule-lesson.dto';
import { ScheduleRecurringLessonDto } from '../dtos/request/schedule-recurring-lesson.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LessonScheduler {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async scheduleLesson(dto: ScheduleLessonDto): Promise<LessonDetailDto> {
    const googleCalendarResponse =
      await this.googleCalendarService.scheduleEvent({
        summary: dto.title,
        startTime: dto.startTime,
        endTime: dto.endTime,
        date: dto.lessonDate,
        description: dto.observations,
      });

    const lessonCreated = LessonFactory.createFromDto(
      dto,
      googleCalendarResponse.eventId!,
      googleCalendarResponse.eventLink!,
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
    dto: ScheduleRecurringLessonDto,
  ): Promise<ScheduleRecurringLessonResponseDto> {
    const googleCalendarResponse =
      await this.googleCalendarService.scheduleEventsWithRecurrence({
        summary: dto.title,
        startTime: dto.startTime,
        endTime: dto.endTime,
        startDate: dto.startDate,
        endDate: dto.endDate,
        description: dto.observations,
        recurrence: dto.recurrence,
        weekdays: dto.weekdays,
      });

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
