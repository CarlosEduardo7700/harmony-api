/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { GoogleCalendarService } from 'src/modules/google/google-calendar.service';
// import { LessonDto } from './dtos/lesson.dto';
import { LessonEventDto } from '../google/dtos/lesson-event.dto';
import { CreateLessonsWithRecurrenceDto } from './dtos/create-lessons-with-recurrence.dto';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  @Post()
  async scheduleLesson(@Body() createLessonDto: CreateLessonDto) {
    const googleCalendarResponse =
      await this.googleCalendarService.scheduleLesson(createLessonDto);

    const databaseResponse = await this.lessonService.saveToDatabase({
      ...createLessonDto,
      googleEventId: googleCalendarResponse.eventId,
      googleEventLink: googleCalendarResponse.eventLink,
    });

    return {
      message: 'Aula agendada com sucesso!',
      lessonData: {
        ...databaseResponse,
      },
    };
  }

  @Post('/schedule-with-recurrence')
  async scheduleLessonsWithRecurrence(
    @Body() createLessonsDto: CreateLessonsWithRecurrenceDto,
  ) {
    // Schedule in the Google Calendar
    const googleCalendarResponse =
      await this.googleCalendarService.scheduleLessonsWithRecurrence(
        createLessonsDto,
      );

    // Save to Postgres database
    for (const lesson of googleCalendarResponse) {
      await this.lessonService.saveToDatabase(lesson);
    }

    return {
      message: `Aulas cadastradas com sucesso!`,
      data: {
        recurringEventId: googleCalendarResponse[0].recurringEventId,
        title: googleCalendarResponse[0].title,
        observations: googleCalendarResponse[0].observations,
        startTime: googleCalendarResponse[0].startTime,
        endTime: googleCalendarResponse[0].endTime,
      },
    };
  }

  @Get()
  async getLessonsEvents(
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<LessonEventDto[]> {
    const lessonEventDto = await this.googleCalendarService.getLessonsEvents(
      month,
      year,
    );
    return lessonEventDto;
  }
}
