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
import { ControllerResponseDto } from './dtos/response/controller-response.dto';
import { LessonDetailDto } from './dtos/response/lesson-detail.dto';
import { ScheduleRecurringLessonResponseDto } from './dtos/response/schedule-recurring-lesson-response.dto';
import { ScheduleLessonDto } from './dtos/request/schedule-lesson.dto';
import { ScheduleRecurringLessonDto } from './dtos/request/schedule-recurring-lesson.dto';
import { EditLessonDto } from './dtos/request/edit-lesson.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async scheduleLesson(
    @Body() dto: ScheduleLessonDto,
  ): Promise<ControllerResponseDto<LessonDetailDto>> {
    const scheduledLesson = await this.lessonService.scheduleLesson(dto);

    return {
      message: 'Aula agendada com sucesso!',
      data: scheduledLesson,
    };
  }

  @Post('/schedule-with-recurrence')
  async scheduleLessonsWithRecurrence(
    @Body() dto: ScheduleRecurringLessonDto,
  ): Promise<ControllerResponseDto<ScheduleRecurringLessonResponseDto>> {
    const scheduledLessons =
      await this.lessonService.scheduleLessonsWithRecurrence(dto);

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
    @Body() dto: EditLessonDto,
  ): Promise<ControllerResponseDto<LessonDetailDto>> {
    const editedLesson = await this.lessonService.editLesson(id, dto);

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
