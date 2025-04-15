export class CreateLessonDto {
  title: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  daysWeek: string[];
  observations: string;
  recurrence: number;
}
