import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Repository } from 'typeorm';
import { GoogleCalendarService } from 'src/modules/google/google-calendar.service';
import { UpdateLessonDto } from '../dtos/update-lesson.dto';
import { NotFoundException } from '@nestjs/common';

export class LessonEditor {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async editLesson(id: string, updateLessonDto: UpdateLessonDto) {
    await this.googleCalendarService.editLessonEvent(updateLessonDto);

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
}
