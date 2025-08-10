/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { ScheduleEventResponseDto } from './dtos/response/schedule-event-response.dto';
import { EventScheduler } from './delegates/event-scheduler';
import { ScheduleEventDto } from './dtos/request/schedule-event.dto';
import { EventCanceller } from './delegates/event-canceller';
import { EventEditor } from './delegates/event-editor';
import { EditEventDto } from './dtos/request/edit-event.dto';
import { ScheduleRecurringEventDto } from './dtos/request/schedule-recurring-event.dto';

@Injectable()
export class GoogleCalendarService {
  constructor(
    private readonly eventScheduler: EventScheduler,
    private readonly eventCanceller: EventCanceller,
    private readonly eventEditor: EventEditor,
  ) {}

  async scheduleEvent(
    dto: ScheduleEventDto,
  ): Promise<ScheduleEventResponseDto> {
    const response = this.eventScheduler.scheduleEvent(dto);
    return response;
  }

  async scheduleEventsWithRecurrence(dto: ScheduleRecurringEventDto) {
    const response = this.eventScheduler.scheduleEventsWithRecurrence(dto);
    return response;
  }

  async editEvent(dto: EditEventDto) {
    const response = this.eventEditor.editEvent(dto);
    return response;
  }

  async cancelEvent(eventId: string) {
    await this.eventCanceller.cancelEvent(eventId);
  }
}
