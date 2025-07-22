/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Between, IsNull, Repository } from 'typeorm';
import { convertUtcToBrIso } from 'src/utils/convertUtcToBrIso';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { GoogleCalendarService } from '../google/google-calendar.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { CreateLessonsWithRecurrenceDto } from './dtos/create-lessons-with-recurrence.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async scheduleLesson(dto: CreateLessonDto) {
    const googleCalendarResponse =
      await this.googleCalendarService.scheduleLesson(dto);

    const lesson = new Lesson();
    lesson.title = dto.title;
    lesson.startTime = dto.startTime;
    lesson.endTime = dto.endTime;
    lesson.lessonDate = new Date(dto.lessonDate);
    lesson.observations = dto.observations || '';
    lesson.googleEventId = googleCalendarResponse.eventId;
    lesson.googleEventLink = googleCalendarResponse.eventLink;
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

  async scheduleLessonsWithRecurrence(dto: CreateLessonsWithRecurrenceDto) {
    const googleCalendarResponse =
      await this.googleCalendarService.scheduleLessonsWithRecurrence(dto);

    for (const lesson of googleCalendarResponse) {
      await this.scheduleLesson(lesson);
    }

    return {
      recurringEventId: googleCalendarResponse[0].recurringEventId,
      title: googleCalendarResponse[0].title,
      observations: googleCalendarResponse[0].observations,
      startTime: googleCalendarResponse[0].startTime,
      endTime: googleCalendarResponse[0].endTime,
    };
  }

  async editLesson(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonRepository.findOneBy({ id });

    if (!lesson) {
      throw new NotFoundException('Aula não encontrada!');
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
      throw new NotFoundException('Aula não encontrada!');
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
        observations: lesson.observations,
      };
    });

    return lessonsList;
  }
}
