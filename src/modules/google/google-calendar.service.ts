/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { CreateLessonDto } from 'src/modules/lesson/dtos/create-lesson.dto';
import { ScheduleLessonDto } from './dtos/schedule-lesson.dto';

@Injectable()
export class GoogleCalendarService {
  private calendar;

  constructor(private configService: ConfigService) {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'src/credentials/google-service-account.json',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async scheduleLesson(
    createLessonDto: CreateLessonDto,
  ): Promise<ScheduleLessonDto> {
    const lessonStartDateTime = `${createLessonDto.startDate}T${createLessonDto.startTime}:00-03:00`;
    const lessonEndDateTime = `${createLessonDto.startDate}T${createLessonDto.endTime}:00-03:00`;
    const date = new Date(`${createLessonDto.endDate}T23:59:59-03:00`);
    const periodEndDate =
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const daysWeekToGoogleCalendar: Record<string, string> = {
      Monday: 'MO',
      Tuesday: 'TU',
      Wednesday: 'WE',
      Thursday: 'TH',
      Friday: 'FR',
      Saturday: 'SA',
      Sunday: 'SU',
    };

    const daysWeek = createLessonDto.daysWeek
      .map((day) => daysWeekToGoogleCalendar[day])
      .join(',');

    const lesson = {
      summary: createLessonDto.title,
      description: createLessonDto.observations,
      start: {
        dateTime: lessonStartDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: lessonEndDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      recurrence: [
        `RRULE:FREQ=WEEKLY;BYDAY=${daysWeek};INTERVAL=${createLessonDto.recurrence};UNTIL=${periodEndDate}`,
      ],
    };

    const calendarId = this.configService.get<string>('CALENDAR_ID');

    const response = await this.calendar.events.insert({
      calendarId,
      requestBody: lesson,
    });

    const { id, summary, description, recurrence } = response.data;

    const lessonsCreated = await this.calendar.events.list({
      calendarId,
      timeMin: new Date(
        `${createLessonDto.startDate}T00:00:00-03:00`,
      ).toISOString(),
      timeMax: new Date(
        `${createLessonDto.endDate}T23:59:59-03:00`,
      ).toISOString(),
      singleEvents: true,
      timeZone: 'America/Sao_Paulo',
    });

    const listLessonsCreated = lessonsCreated.data.items
      .filter((e) => e.recurringEventId === id)
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
      lessons: listLessonsCreated,
    };
  }
}
