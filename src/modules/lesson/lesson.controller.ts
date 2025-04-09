/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Controller, Post, Body } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto) {
    const lesson = await this.lessonService.create(createLessonDto);

    return {
      lesson: lesson,
      message: `Aula do dia ${createLessonDto.lessonDate} cadastrada com sucesso!`,
    };
  }
}
