import { Controller } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ANALYTICS_PATTERNS } from '@app/contracts/analytics/analytics.patterns';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @MessagePattern(ANALYTICS_PATTERNS.OVERVIEW)
  async getOverview() {
    return await this.analyticsService.getOverview()
  }
}
