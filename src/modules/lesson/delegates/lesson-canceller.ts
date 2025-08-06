import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { GoogleCalendarService } from 'src/modules/google/google-calendar.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonDetailDto } from '../dtos/response/lesson-detail.dto';

@Injectable()
export class LessonCanceller {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async cancelLesson(id: string): Promise<LessonDetailDto> {
    const lesson = await this.lessonRepository.findOneBy({ id });

    if (!lesson) {
      throw new NotFoundException('Aula não encontrada!');
    }

    lesson['deletedAt'] = new Date().toISOString();

    const databaseResponse = await this.lessonRepository.save(lesson);

    await this.googleCalendarService.cancelLessonEvent(
      databaseResponse.googleEventId,
    );

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
}
