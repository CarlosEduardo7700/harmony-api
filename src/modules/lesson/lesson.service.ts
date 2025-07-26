import { Injectable } from '@nestjs/common';
import { LessonScheduler } from './delegates/lesson-scheduler';
import { LessonReader } from './delegates/lesson-reader';
import { LessonEditor } from './delegates/lesson-editor';
import { LessonCanceller } from './delegates/lesson-canceller';
import { ScheduleLessonDto } from './dtos/request/schedule-lesson.dto';
import { ScheduleRecurringLessonDto } from './dtos/request/schedule-recurring-lesson.dto';
import { EditLessonDto } from './dtos/request/edit-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    private readonly lessonScheduler: LessonScheduler,
    private readonly lessonReader: LessonReader,
    private readonly lessonEditor: LessonEditor,
    private readonly lessonCanceller: LessonCanceller,
  ) {}

  async scheduleLesson(dto: ScheduleLessonDto) {
    const scheduledLesson = await this.lessonScheduler.scheduleLesson(dto);
    return scheduledLesson;
  }

  async scheduleLessonsWithRecurrence(dto: ScheduleRecurringLessonDto) {
    const scheduledLessons =
      await this.lessonScheduler.scheduleLessonsWithRecurrence(dto);
    return scheduledLessons;
  }

  async getLessons(month: number, year: number) {
    const lessons = await this.lessonReader.getLessons(month, year);
    return lessons;
  }

  async editLesson(id: string, dto: EditLessonDto) {
    const editedLesson = await this.lessonEditor.editLesson(id, dto);
    return editedLesson;
  }

  async cancelLesson(id: string) {
    const canceledLesson = await this.lessonCanceller.cancelLesson(id);
    return canceledLesson;
  }
}
