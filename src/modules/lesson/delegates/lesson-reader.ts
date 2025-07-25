import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lesson.entity';
import { Between, IsNull, Repository } from 'typeorm';
import { LessonDetailDto } from '../dtos/response/lesson-detail.dto';

export class LessonReader {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async getLessons(month: number, year: number): Promise<LessonDetailDto[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const lessons = await this.lessonRepository.find({
      where: {
        lessonDate: Between(startDate, endDate),
        deletedAt: IsNull(),
      },
    });

    const lessonsList: LessonDetailDto[] = lessons.map((lesson) => {
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
