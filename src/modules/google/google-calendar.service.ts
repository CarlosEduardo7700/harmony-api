/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { CreateLessonDto } from 'src/modules/lesson/dtos/create-lesson.dto';
import { ScheduleLessonDto } from './dtos/schedule-lesson.dto';
import { createEventWithRecurrence } from './utils/createEventWithRecurrence';
import { LessonEventDto } from './dtos/lesson-event.dto';
import { getFirstDayOfTheMonth } from './utils/getFirstDayOfTheMonth';
import { getLastDayOfTheMonth } from './utils/getLastDayOfTheMonth';
import { getDateFromISOString } from './utils/getDateFromISOString';
import { getTimeFromISOString } from './utils/getTimeFromISOString';
import { createEvent } from './utils/createEvent';
import { CreateLessonWithRecurrenceDto } from '../lesson/dtos/create-lesson-with-recurrence.dto';

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

  async scheduleLesson(createLessonDto: CreateLessonDto) {
    const lesson = createEvent(createLessonDto);

    const eventCreated = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: lesson,
    });

    return {
      eventLink: eventCreated.data.htmlLink,
    };
  }

  async scheduleLessonsWithRecurrence(
    createLessonDto: CreateLessonWithRecurrenceDto,
  ): Promise<ScheduleLessonDto> {
    const lesson = createEventWithRecurrence({
      summary: createLessonDto.title,
      description: createLessonDto.observations,
      startDate: createLessonDto.startDate,
      startTime: createLessonDto.startTime,
      endDate: createLessonDto.endDate,
      endTime: createLessonDto.endTime,
      weekdays: createLessonDto.weekdays,
      interval: createLessonDto.recurrence,
    });

    const eventsCreated = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: lesson,
    });

    const { id, summary, description, recurrence } = eventsCreated.data;

    const eventsList = await this.calendar.events.list({
      calendarId: this.calendarId,
      timeMin: new Date(`${createLessonDto.startDate}T00:00:00-03:00`),
      timeMax: new Date(`${createLessonDto.endDate}T23:59:59-03:00`),
      singleEvents: true,
      timeZone: 'America/Sao_Paulo',
    });

    const lessonsCreatedList = eventsList.data.items
      .filter((event) => event.recurringEventId === id)
      .map((lesson) => {
        return {
          id: lesson.id,
          link: lesson.htmlLink,
          startDateTime: lesson.start.dateTime,
          endDateTime: lesson.end.dateTime,
        };
      });

    return {
      recurringEventId: id,
      summary: summary,
      description: description,
      recurrence: recurrence[0],
      lessons: lessonsCreatedList,
    };
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
        const startTime = getTimeFromISOString(lesson.start.dateTime);
        const endTime = getTimeFromISOString(lesson.end.dateTime);
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
}
