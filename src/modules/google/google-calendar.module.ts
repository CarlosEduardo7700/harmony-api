import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { EventScheduler } from './delegates/event-scheduler';

@Module({
  providers: [GoogleCalendarService, EventScheduler],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarModule {}
