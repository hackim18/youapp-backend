import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('liveness')
  @ApiOkResponse({ description: 'Liveness probe' })
  liveness() {
    return this.healthService.getLiveness();
  }

  @Get('readiness')
  @ApiOkResponse({ description: 'Readiness probe (checks MongoDB)' })
  readiness() {
    return this.healthService.getReadiness();
  }
}
