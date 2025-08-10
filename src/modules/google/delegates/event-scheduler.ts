/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ScheduleEventDto } from '../dtos/request/schedule-event.dto';
import { createEvent } from '../utils/createEvent';
import { ScheduleEventResponseDto } from '../dtos/response/schedule-event-response.dto';
import { Injectable } from '@nestjs/common';
import { CalendarFactory } from '../factories/calendar.factory';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventScheduler {
  private calendar;
  private calendarId;

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
}
