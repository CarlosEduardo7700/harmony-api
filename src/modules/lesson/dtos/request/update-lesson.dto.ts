import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './request/create-lesson.dto';
import { IsString } from 'class-validator';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  @IsString({ message: 'O ID do evento deve ser uma string.' })
  googleEventId: string;
}
