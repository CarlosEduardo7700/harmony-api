import { Injectable } from '@nestjs/common';
import { LessonScheduler } from './delegates/lesson-scheduler';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { CreateLessonsWithRecurrenceDto } from './dtos/create-lessons-with-recurrence.dto';
import { LessonReader } from './delegates/lesson-reader';
import { LessonEditor } from './delegates/lesson-editor';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { LessonCanceller } from './delegates/lesson-canceller';

@Injectable()
export class LessonService {
  constructor(
    private readonly lessonScheduler: LessonScheduler,
    private readonly lessonReader: LessonReader,
    private readonly lessonEditor: LessonEditor,
    private readonly lessonCanceller: LessonCanceller,
  ) {}

  async scheduleLesson(dto: CreateLessonDto) {
    const response = await this.lessonScheduler.scheduleLesson(dto);
    return response;
  }

  async scheduleLessonsWithRecurrence(dto: CreateLessonsWithRecurrenceDto) {
    const response =
      await this.lessonScheduler.scheduleLessonsWithRecurrence(dto);
    return response;
  }

  async getLessons(month: number, year: number) {
    const response = await this.lessonReader.getLessons(month, year);
    return response;
  }

  async editLesson(id: string, updateLessonDto: UpdateLessonDto) {
    const response = await this.lessonEditor.editLesson(id, updateLessonDto);
    return response;
  }

  async cancelLesson(id: string) {
    const response = await this.lessonCanceller.cancelLesson(id);
    return response;
  }
}
