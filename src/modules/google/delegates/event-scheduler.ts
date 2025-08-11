import { ScheduleEventDto } from '../dtos/request/schedule-event.dto';
import { createEvent } from '../utils/createEvent';
import { ScheduleEventResponseDto } from '../dtos/response/schedule-event-response.dto';
import { Injectable } from '@nestjs/common';
import { CalendarFactory } from '../factories/calendar.factory';
import { ConfigService } from '@nestjs/config';
import { createEventWithRecurrence } from '../utils/createEventWithRecurrence';
import { getDateFromISOString } from '../utils/getDateFromISOString';
import { ScheduleRecurringEventDto } from '../dtos/request/schedule-recurring-event.dto';
import { calendar_v3 } from 'googleapis';

@Injectable()
export class EventScheduler {
  private calendar: calendar_v3.Calendar;
  private calendarId: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.calendar = CalendarFactory.create(configService);
    this.calendarId = this.configService.get<string>('CALENDAR_ID');
  }

  async scheduleEvent(
    dto: ScheduleEventDto,
  ): Promise<ScheduleEventResponseDto> {
    const event = createEvent(dto);

    const eventCreated = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: event,
    });

    return {
      eventId: eventCreated.data.id,
      eventLink: eventCreated.data.htmlLink,
    };
  }

  async scheduleEventsWithRecurrence(dto: ScheduleRecurringEventDto) {
    const lesson = createEventWithRecurrence(dto);

    const eventsCreated = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: lesson,
    });

    const { id } = eventsCreated.data;

    if (!id) {
      throw new Error('ID não encontrado!');
    }

    const eventsList = await this.calendar.events.instances({
      calendarId: this.calendarId,
      eventId: id,
    });

    if (!eventsList.data.items) {
      throw new Error('Itens não encontrados!');
    }

    const lessonsCreatedList = eventsList.data.items
      .filter((event) => event.recurringEventId === id)
      .map((lesson: calendar_v3.Schema$Event) => {
        return {
          recurringEventId: id,
          googleEventId: lesson.id,
          googleEventLink: lesson.htmlLink,
          title: lesson.summary!,
          startTime: dto.startTime,
          endTime: dto.endTime,
          lessonDate: getDateFromISOString(lesson.start!.dateTime!),
          observations: lesson.description!,
        };
      });

    return lessonsCreatedList;
  }
}
