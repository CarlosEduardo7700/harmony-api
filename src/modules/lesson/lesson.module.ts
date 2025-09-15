import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { LessonScheduler } from './delegates/lesson-scheduler';
import { LessonCanceller } from './delegates/lesson-canceller';
import { LessonEditor } from './delegates/lesson-editor';
import { LessonReader } from './delegates/lesson-reader';
import { GoogleCalendarModule } from '../google/google-calendar.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), GoogleCalendarModule],
  controllers: [LessonController],
  providers: [
    LessonService,
    LessonScheduler,
    LessonEditor,
    LessonReader,
    LessonCanceller,
  ],
})
export class LessonModule {}
