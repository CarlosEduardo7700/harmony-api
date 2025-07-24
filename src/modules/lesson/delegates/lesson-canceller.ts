import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { GoogleCalendarService } from 'src/modules/google/google-calendar.service';
import { NotFoundException } from '@nestjs/common';

export class LessonCanceller {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async cancelLesson(id: string) {
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
      title: databaseResponse.title,
      lessonDate: databaseResponse.lessonDate,
      googleEventId: databaseResponse.googleEventId,
    };
  }
}
