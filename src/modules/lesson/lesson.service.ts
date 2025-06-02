import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { LessonDto } from './dtos/lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async saveToDatabase(
    createLessonDto: CreateLessonDto,
    lessonStartDateTime: string,
    lessonEndDateTime: string,
  ): Promise<LessonDto> {
    const lesson = new Lesson();

    const startDateTime = lessonStartDateTime.replace('-03:00', '').split('T');
    const endDateTime = lessonEndDateTime.replace('-03:00', '').split('T');

    lesson.title = createLessonDto.title;
    lesson.startTime = startDateTime[1];
    lesson.endTime = endDateTime[1];
    lesson.lessonDate = startDateTime[0];
    lesson.observations = createLessonDto.observations;

    const databaseResponse = await this.lessonRepository.save(lesson);

    return {
      id: databaseResponse.id,
      lessonDate: databaseResponse.lessonDate,
      startTime: databaseResponse.startTime,
      endTime: databaseResponse.endTime,
      createdAt: databaseResponse.createdAt,
    };
  }
}
