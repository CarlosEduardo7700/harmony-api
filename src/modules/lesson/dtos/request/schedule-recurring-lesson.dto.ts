import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class ScheduleRecurringLessonDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @Length(3, 100, { message: 'O título deve ter entre 3 e 100 caracteres.' })
  title: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'O horário de início deve estar no formato HH:mm.',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'O horário de início deve estar no formato HH:mm.',
  })
  endTime: string;

  @IsNotEmpty({ message: 'A data inicial é obrigatória.' })
  @IsDateString(
    {},
    { message: 'A data inicial deve estar no formato YYYY-MM-DD.' },
  )
  startDate: string;

  @IsNotEmpty({ message: 'A data final é obrigatória.' })
  @IsDateString(
    {},
    { message: 'A data final deve estar no formato YYYY-MM-DD.' },
  )
  endDate: string;

  @IsArray({ message: 'Os dias da semana devem estar em um array.' })
  @ArrayNotEmpty({ message: 'Pelo menos um dia da semana deve ser informado.' })
  @IsIn(
    [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    {
      each: true,
      message:
        'Os dias da semana devem ser: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
    },
  )
  weekdays: string[];

  @IsOptional()
  @IsString()
  @Length(0, 500, {
    message: 'As observações devem ter no máximo 500 caracteres.',
  })
  observations?: string;

  @IsInt({ message: 'A recorrência deve ser um número inteiro.' })
  @Min(1, { message: 'A recorrência deve ser de no mínimo 1 semana.' })
  recurrence: number;
}
