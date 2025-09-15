import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { ScheduleEventDto } from './schedule-event.dto';

export class EditEventDto extends PartialType(ScheduleEventDto) {
  @IsString({ message: 'O ID do evento deve ser uma string.' })
  googleEventId: string;
}
