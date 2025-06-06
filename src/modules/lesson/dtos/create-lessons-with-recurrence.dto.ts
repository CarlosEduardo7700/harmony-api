export class CreateLessonsWithRecurrenceDto {
  title: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  weekdays: string[];
  observations: string;
  recurrence: number;
}
