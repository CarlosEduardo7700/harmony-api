export class ScheduleLessonResponseDto {
  id: string;
  title: string;
  lessonDate: Date;
  startTime: string;
  endTime: string;
  observations: string;
  googleEventId: string;
  googleEventLink: string;
  createdAt: string;
}
