/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { LessonDto } from './dtos/lesson.dto';
import { convertUtcToBrIso } from 'src/utils/convertUtcToBrIso';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async saveToDatabase(data): Promise<LessonDto> {
    const lesson = new Lesson();
    lesson.title = data.title;
    lesson.startTime = data.startTime;
    lesson.endTime = data.endTime;
    lesson.lessonDate = data.date;
    lesson.observations = data.observations;
    lesson.googleEventId = data.googleEventId;
    lesson.googleEventLink = data.googleEventLink;
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
      googleEventId: databaseResponse.googleEventId,
      googleEventLink: databaseResponse.googleEventLink,
      createdAt: convertUtcToBrIso(databaseResponse.createdAt),
    };
  }
}
