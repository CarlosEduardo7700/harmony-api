import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { GoogleCalendarService } from 'src/modules/google/google-calendar.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonDetailDto } from '../dtos/response/lesson-detail.dto';
import { EditLessonDto } from '../dtos/request/edit-lesson.dto';

@Injectable()
export class LessonEditor {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async editLesson(id: string, dto: EditLessonDto): Promise<LessonDetailDto> {
    await this.googleCalendarService.editLessonEvent(dto);

    const lesson = await this.lessonRepository.findOneBy({ id });

    if (!lesson) {
      throw new NotFoundException('Aula não encontrada!');
    }

    dto['updatedAt'] = new Date().toISOString();

    Object.assign(lesson, dto);

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
}
