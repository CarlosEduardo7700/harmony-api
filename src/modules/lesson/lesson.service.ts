import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    const lesson = new Lesson();

    lesson.title = createLessonDto.title;
    lesson.startTime = createLessonDto.startTime;
    lesson.endTime = createLessonDto.endTime;
    lesson.lessonDate = createLessonDto.lessonDate;
    lesson.observations = createLessonDto.observations;

    return this.lessonRepository.save(lesson);
  }
}
