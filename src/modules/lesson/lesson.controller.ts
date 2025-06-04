/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

    const databaseResponse = await this.lessonService.saveToDatabase(
      createLessonDto,
      googleCalendarResponse.eventId,
    );

    return {
      message: 'Aula agendada com sucesso!',
      lessonData: {
        ...databaseResponse,
        googleCalendarEventData: { ...googleCalendarResponse },
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
    // const lessonsList: LessonDto[] = [];

    // for (const lesson of googleCalendarResponse.lessons) {
    //   const lessonSaved =
    //     await this.lessonService.saveToDatabase(createLessonsDto);

    //   lessonsList.push(lessonSaved);
    // }

    return {
      message: `Aulas cadastradas com sucesso!`,
      // lessonsData: lessonsList,
      googleCalendarEventsData: googleCalendarResponse,
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
