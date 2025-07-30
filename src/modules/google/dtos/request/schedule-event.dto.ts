import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ScheduleEventDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @Length(3, 100, { message: 'O título deve ter entre 3 e 100 caracteres.' })
  summary: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'O horário de início deve estar no formato HH:mm.',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'O horário de término deve estar no formato HH:mm.',
  })
  endTime: string;

  @IsDateString({}, { message: 'Data deve estar no formato yyyy-mm-dd' })
  date: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, {
    message: 'As observações devem ter no máximo 500 caracteres.',
  })
  description?: string;
}
