/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createEventWithRecurrence } from './utils/createEventWithRecurrence';
import { getDateFromISOString } from './utils/getDateFromISOString';
import { ScheduleEventResponseDto } from './dtos/response/schedule-event-response.dto';
import { ScheduleRecurringLessonDto } from '../lesson/dtos/request/schedule-recurring-lesson.dto';
import { CalendarFactory } from './factories/calendar.factory';
import { EventScheduler } from './delegates/event-scheduler';
import { ScheduleEventDto } from './dtos/request/schedule-event.dto';
import { EventCanceller } from './delegates/event-canceller';
import { EventEditor } from './delegates/event-editor';
import { EditEventDto } from './dtos/request/edit-event.dto';

@Injectable()
export class GoogleCalendarService {
  private calendar;
  private calendarId;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventScheduler: EventScheduler,
    private readonly eventCanceller: EventCanceller,
    private readonly eventEditor: EventEditor,
  ) {
    this.calendar = CalendarFactory.create(configService);
    this.calendarId = this.configService.get<string>('CALENDAR_ID');
  }

  async scheduleEvent(
    dto: ScheduleEventDto,
  ): Promise<ScheduleEventResponseDto> {
    const response = this.eventScheduler.scheduleEvent(dto);
    return response;
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

  async editEvent(dto: EditEventDto) {
    const response = this.eventEditor.editEvent(dto);
    return response;
  }

  async cancelEvent(eventId: string) {
    await this.eventCanceller.cancelEvent(eventId);
  }
}
