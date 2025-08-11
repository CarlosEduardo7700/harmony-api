import { Injectable } from '@nestjs/common';
import { CalendarFactory } from '../factories/calendar.factory';
import { ConfigService } from '@nestjs/config';
import { updateEvent } from '../utils/updateEvent';
import { EditEventDto } from '../dtos/request/edit-event.dto';
import { calendar_v3 } from 'googleapis';

@Injectable()
export class EventEditor {
  private calendar: calendar_v3.Calendar;
  private calendarId: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.calendar = CalendarFactory.create(configService);
    this.calendarId = this.configService.get<string>('CALENDAR_ID');
  }

  async editEvent(dto: EditEventDto) {
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
}
