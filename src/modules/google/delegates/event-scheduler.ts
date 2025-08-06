/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ScheduleEventDto } from '../dtos/request/schedule-event.dto';
import { createEvent } from '../utils/createEvent';
import { ScheduleEventResponseDto } from '../dtos/response/schedule-event-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventScheduler {
  constructor(
    private readonly calendar,
    private readonly calendarId,
  ) {}

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
