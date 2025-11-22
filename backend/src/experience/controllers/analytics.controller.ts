import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from '../../process/services/analytics.service';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('overview')
    async getOverview(@Req() req) {
        return this.analyticsService.getOverview(req.user.userId);
    }

    @Get('by-project')
    async getByProject(@Req() req) {
        return this.analyticsService.getByProject(req.user.userId);
    }

    @Get('chart-data')
    async getChartData(@Req() req) {
        return this.analyticsService.getChartData(req.user.userId);
    }
}
