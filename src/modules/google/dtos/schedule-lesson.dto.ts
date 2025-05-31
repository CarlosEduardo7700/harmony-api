interface EventLesson {
  id: string;
  link: string;
  startDateTime: string;
  endDateTime: string;
}

export class ScheduleLessonDto {
  readonly recurringEventId: string;
  readonly summary: string;
  readonly description: string;
  readonly recurrence: string;
  readonly lessons: EventLesson[];

  constructor(
    recurringEventId: string,
    summary: string,
    description: string,
    recurrence: string,
    lessons: EventLesson[],
  ) {
    this.recurringEventId = recurringEventId;
    this.summary = summary;
    this.description = description;
    this.recurrence = recurrence;
    this.lessons = lessons;
  }
}
