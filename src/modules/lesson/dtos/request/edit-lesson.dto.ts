import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { ScheduleLessonDto } from './schedule-lesson.dto';

export class EditLessonDto extends PartialType(ScheduleLessonDto) {
  @IsString({ message: 'O ID do evento deve ser uma string.' })
  googleEventId: string;
}
