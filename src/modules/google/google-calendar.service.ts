/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { createEventWithRecurrence } from './utils/createEventWithRecurrence';
import { LessonEventDto } from './dtos/lesson-event.dto';
import { getFirstDayOfTheMonth } from './utils/getFirstDayOfTheMonth';
import { getLastDayOfTheMonth } from './utils/getLastDayOfTheMonth';
import { getDateFromISOString } from './utils/getDateFromISOString';
import { getTimeFromISOString } from './utils/getTimeFromISOString';
import { createEvent } from './utils/createEvent';
import { updateEvent } from './utils/updateEvent';
import { ScheduleLessonResponseDto } from './dtos/schedule-lesson-response.dto';
import { ScheduleLessonDto } from '../lesson/dtos/request/schedule-lesson.dto';
import { ScheduleRecurringLessonDto } from '../lesson/dtos/request/schedule-recurring-lesson.dto';
import { EditLessonDto } from '../lesson/dtos/request/edit-lesson.dto';

@Injectable()
export class GoogleCalendarService {
  private calendar;
  private calendarId;

  constructor(private configService: ConfigService) {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'src/credentials/google-service-account.json',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    this.calendar = google.calendar({ version: 'v3', auth });
    this.calendarId = this.configService.get<string>('CALENDAR_ID');
  }

  async scheduleLesson(
    dto: ScheduleLessonDto,
  ): Promise<ScheduleLessonResponseDto> {
    const lesson = createEvent(dto);

    const eventCreated = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: lesson,
    });

    return {
      eventId: eventCreated.data.id,
      eventLink: eventCreated.data.htmlLink,
    };
  }

  async scheduleLessonsWithRecurrence(dto: ScheduleRecurringLessonDto) {
    const lesson = createEventWithRecurrence(dto);

    const eventsCreated = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: lesson,
    });

    const { id } = eventsCreated.data;

    const eventsList = await this.calendar.events.instances({
      calendarId: this.calendarId,
      eventId: id,
    });

    const lessonsCreatedList = eventsList.data.items
      .filter((event) => event.recurringEventId === id)
      .map((lesson) => {
        return {
          recurringEventId: id,
          googleEventId: lesson.id,
          googleEventLink: lesson.htmlLink,
          title: lesson.summary,
          startTime: dto.startTime,
          endTime: dto.endTime,
          lessonDate: getDateFromISOString(lesson.start.dateTime),
          observations: lesson.description,
        };
      });

    return lessonsCreatedList;
  }

  async getLessonsEvents(
    month: number,
    year: number,
  ): Promise<LessonEventDto[]> {
    const firstDayOfTheMonth = getFirstDayOfTheMonth(year, month);
    const lastDayOfTheMonth = getLastDayOfTheMonth(year, month);

    const lessonsEvents = await this.calendar.events.list({
      calendarId: this.calendarId,
      timeMin: firstDayOfTheMonth,
      timeMax: lastDayOfTheMonth,
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'America/Sao_Paulo',
    });

    const lessonEventDto: LessonEventDto[] = lessonsEvents.data.items.map(
      (lesson) => {
        const startTime = getTimeFromISOString(lesson.start.dateTime) + ':00';
        const endTime = getTimeFromISOString(lesson.end.dateTime) + ':00';
        const lessonDate = getDateFromISOString(lesson.start.dateTime);

        return new LessonEventDto(
          lesson.id,
          lesson.htmlLink,
          lesson.summary,
          lesson.description,
          startTime,
          endTime,
          lessonDate,
        );
      },
    );

    return lessonEventDto;
  }

  async editLessonEvent(dto: EditLessonDto) {
    const lessonEvent = await this.calendar.events.get({
      calendarId: this.calendarId,
      eventId: dto.googleEventId,
    });

    const lessonData = updateEvent(dto, lessonEvent);

    const response = await this.calendar.events.patch({
      calendarId: this.calendarId,
      eventId: dto.googleEventId,
      requestBody: lessonData,
    });

    return response;
  }

  async cancelLessonEvent(eventId: string) {
    await this.calendar.events.delete({
      calendarId: this.calendarId,
      eventId: eventId,
    });
  }
}
