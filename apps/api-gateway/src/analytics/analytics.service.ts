import { Inject, Injectable } from '@nestjs/common';
import { ANALYTICS } from 'libs/contracts/constant';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ANALYTICS_PATTERNS } from '@app/contracts/analytics/analytics.patterns';
import { handleMicroserviceError } from '@app/contracts/helper-functions';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(ANALYTICS)
    private readonly analyticsService: ClientProxy
  ) { }

  getOverview = async () => {
    try {
      const response = await firstValueFrom(
        this.analyticsService.send(ANALYTICS_PATTERNS.OVERVIEW, {})
      )
      return response
    } catch (error) {
      handleMicroserviceError(error)
    }
  }
}
