export class LessonEventDto {
  readonly id: string;
  readonly link: string;
  readonly title: string;
  readonly observations: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly lessonDate: string;

  constructor(
    id: string,
    link: string,
    title: string,
    observations: string,
    startTime: string,
    endTime: string,
    lessonDate: string,
  ) {
    this.id = id;
    this.link = link;
    this.title = title;
    this.observations = observations;
    this.startTime = startTime;
    this.endTime = endTime;
    this.lessonDate = lessonDate;
  }
}
