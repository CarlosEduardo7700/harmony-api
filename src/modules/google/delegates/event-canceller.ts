/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigService } from '@nestjs/config';
import { CalendarFactory } from '../factories/calendar.factory';

export class EventCanceller {
  private calendar;
  private calendarId;

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
