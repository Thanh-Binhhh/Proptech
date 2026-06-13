import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  getOverview = async () => {
    return 'Hello World!';
  }
}
