import { ConfigService } from '@nestjs/config';
import { CalendarFactory } from '../factories/calendar.factory';
import { Injectable } from '@nestjs/common';
import { calendar_v3 } from 'googleapis';

@Injectable()
export class EventCanceller {
  private calendar: calendar_v3.Calendar;
  private calendarId: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.calendar = CalendarFactory.create(configService);
    this.calendarId = this.configService.get<string>('CALENDAR_ID');
  }

  async cancelEvent(eventId: string) {
    await this.calendar.events.delete({
      calendarId: this.calendarId,
      eventId: eventId,
    });
  }
}
