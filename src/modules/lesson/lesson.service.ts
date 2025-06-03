import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { LessonDto } from './dtos/lesson.dto';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { convertUtcToBrIso } from 'src/utils/convertUtcToBrIso';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async saveToDatabase(createLessonDto: CreateLessonDto): Promise<LessonDto> {
    const lesson = new Lesson();
    lesson.title = createLessonDto.title;
    lesson.startTime = createLessonDto.startTime;
    lesson.endTime = createLessonDto.endTime;
    lesson.lessonDate = createLessonDto.date;
    lesson.observations = createLessonDto.observations;
    lesson.createdAt = new Date().toISOString();
    lesson.updatedAt = new Date().toISOString();

    const databaseResponse = await this.lessonRepository.save(lesson);

    return {
      id: databaseResponse.id,
      title: databaseResponse.title,
      lessonDate: databaseResponse.lessonDate,
      startTime: databaseResponse.startTime,
      endTime: databaseResponse.endTime,
      observations: databaseResponse.observations,
      createdAt: convertUtcToBrIso(databaseResponse.createdAt),
    };
  }
}
