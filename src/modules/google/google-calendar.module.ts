import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { EventScheduler } from './delegates/event-scheduler';
import { EventCanceller } from './delegates/event-canceller';
import { EventEditor } from './delegates/event-editor';

@Module({
  providers: [
    GoogleCalendarService,
    EventScheduler,
    EventCanceller,
    EventEditor,
  ],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarModule {}
