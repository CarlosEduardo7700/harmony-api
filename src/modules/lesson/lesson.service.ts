/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Between, IsNull, Repository } from 'typeorm';
import { LessonDto } from './dtos/lesson.dto';
import { convertUtcToBrIso } from 'src/utils/convertUtcToBrIso';
import { UpdateLessonDto } from './dtos/update-lesson.dto';

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
    lesson.lessonDate = data.lessonDate;
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

  async editLesson(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonRepository.findOneBy({ id });

    if (!lesson) {
      throw new Error('Aula não encontrada!');
    }

    updateLessonDto['updatedAt'] = new Date().toISOString();

    Object.assign(lesson, updateLessonDto);

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
    };
  }

  async cancelLesson(id: string) {
    const lesson = await this.lessonRepository.findOneBy({ id });

    if (!lesson) {
      throw new Error('Aula não encontrada!');
    }

    lesson['deletedAt'] = new Date().toISOString();

    const databaseResponse = await this.lessonRepository.save(lesson);

    return {
      title: databaseResponse.title,
      lessonDate: databaseResponse.lessonDate,
      googleEventId: databaseResponse.googleEventId,
    };
  }

  async getLessons(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const lessons = await this.lessonRepository.find({
      where: {
        lessonDate: Between(startDate, endDate),
        deletedAt: IsNull(),
      },
    });

    const lessonsList = lessons.map((lesson) => {
      return {
        id: lesson.id,
        googleEventId: lesson.googleEventId,
        googleEventLink: lesson.googleEventLink,
        title: lesson.title,
        lessonDate: lesson.lessonDate,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        observation: lesson.observations,
      };
    });

    return lessonsList;
  }
}
