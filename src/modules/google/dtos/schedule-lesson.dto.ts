export class ScheduleLessonDto {
  recurringEventId: string;
  summary: string;
  description: string;
  recurrence: string;
  lessons: {
    id: string;
    link: string;
    startDateTime: string;
    endDateTime: string;
  }[];
}
