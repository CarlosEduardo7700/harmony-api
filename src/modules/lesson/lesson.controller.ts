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
import { CreateLessonDto } from './dtos/request/create-lesson.dto';
import { CreateLessonsWithRecurrenceDto } from './dtos/request/create-lessons-with-recurrence.dto';
import { UpdateLessonDto } from './dtos/request/update-lesson.dto';
import { ControllerResponseDto } from './dtos/response/controller-response.dto';
import { LessonDetailDto } from './dtos/response/lesson-detail.dto';
import { ScheduleRecurringLessonResponseDto } from './dtos/response/schedule-lesson-recurrence-response.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async scheduleLesson(
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<ControllerResponseDto<LessonDetailDto>> {
    const scheduledLesson =
      await this.lessonService.scheduleLesson(createLessonDto);

    return {
      message: 'Aula agendada com sucesso!',
      data: scheduledLesson,
    };
  }

  @Post('/schedule-with-recurrence')
  async scheduleLessonsWithRecurrence(
    @Body() createLessonsDto: CreateLessonsWithRecurrenceDto,
  ): Promise<ControllerResponseDto<ScheduleRecurringLessonResponseDto>> {
    const scheduledLessons =
      await this.lessonService.scheduleLessonsWithRecurrence(createLessonsDto);

    return {
      message: 'Aulas agendadas com sucesso!',
      data: scheduledLessons,
    };
  }

  @Get()
  async getLessons(
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<ControllerResponseDto<LessonDetailDto[]>> {
    const lessons = await this.lessonService.getLessons(month, year);
    return {
      message: `${lessons.length} aulas encontradas.`,
      data: lessons,
    };
  }

  @Patch('/:id')
  async editLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<ControllerResponseDto<LessonDetailDto>> {
    const editedLesson = await this.lessonService.editLesson(
      id,
      updateLessonDto,
    );

    return {
      message: 'Aula atualizada com sucesso!',
      data: editedLesson,
    };
  }

  @Delete('/:id')
  async cancelLesson(
    @Param('id') id: string,
  ): Promise<ControllerResponseDto<LessonDetailDto>> {
    const canceledLesson = await this.lessonService.cancelLesson(id);

    return {
      message: 'Aula cancelada com sucesso!',
      data: canceledLesson,
    };
  }
}
