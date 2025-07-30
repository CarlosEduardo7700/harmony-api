import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

export class CalendarFactory {
  static create(configService: ConfigService) {
    const auth = new google.auth.GoogleAuth({
      keyFile: configService.get<string>('GOOGLE_CREDENTIAL_PATH'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return google.calendar({ version: 'v3', auth });
  }
}
