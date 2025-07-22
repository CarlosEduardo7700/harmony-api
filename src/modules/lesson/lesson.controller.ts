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
import { CreateLessonsWithRecurrenceDto } from './dtos/create-lessons-with-recurrence.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { GoogleCalendarService } from '../google/google-calendar.service';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  @Post()
  async scheduleLesson(@Body() createLessonDto: CreateLessonDto) {
    const lessonData = await this.lessonService.scheduleLesson(createLessonDto);

    return {
      message: 'Aula agendada com sucesso!',
      lessonData: lessonData,
    };
  }

  @Post('/schedule-with-recurrence')
  async scheduleLessonsWithRecurrence(
    @Body() createLessonsDto: CreateLessonsWithRecurrenceDto,
  ) {
    const response =
      await this.lessonService.scheduleLessonsWithRecurrence(createLessonsDto);

    return {
      message: `Aulas cadastradas com sucesso!`,
      data: response,
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
