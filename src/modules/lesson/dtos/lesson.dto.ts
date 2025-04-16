import { ObjectId } from 'mongodb';

export class LessonDto {
  id: ObjectId;
  lessonDate: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
}
