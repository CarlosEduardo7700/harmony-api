/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { GoogleCalendarService } from 'src/modules/google/google-calendar.service';
// import { LessonDto } from './dtos/lesson.dto';
import { CreateLessonsWithRecurrenceDto } from './dtos/create-lessons-with-recurrence.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';

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
    const googleCalendarResponse =
      await this.googleCalendarService.scheduleLessonsWithRecurrence(
        createLessonsDto,
      );

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
  async getLessons(@Query('month') month: number, @Query('year') year: number) {
    const lessons = await this.lessonService.getLessons(month, year);
    return lessons;
  }

  @Patch('/:id')
  async editLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    await this.googleCalendarService.editLessonEvent(updateLessonDto);

    const lessonUpdated = await this.lessonService.editLesson(
      id,
      updateLessonDto,
    );

    return {
      message: 'Aula atualizada com sucesso!',
      data: {
        ...lessonUpdated,
      },
    };
  }

  @Delete('/:id')
  async cancelLesson(@Param('id') id: string) {
    const lessonCanceled = await this.lessonService.cancelLesson(id);

    await this.googleCalendarService.cancelLessonEvent(
      lessonCanceled.googleEventId,
    );

    return {
      message: `Aula cancelada!`,
      data: lessonCanceled,
    };
  }
}
