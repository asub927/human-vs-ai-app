import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiOrchestratorService } from '../../process/services/ai-orchestrator.service';
import { ChatMessageDto, EstimateTaskDto } from '../dto/ai.dto';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
    constructor(private aiOrchestratorService: AiOrchestratorService) { }

    @Post('chat')
    async chat(@Body() dto: ChatMessageDto, @Req() req) {
        return this.aiOrchestratorService.chat(req.user.userId, dto.message);
    }

    @Post('estimate')
    async estimate(@Body() dto: EstimateTaskDto, @Req() req) {
        return this.aiOrchestratorService.estimateTask(
            req.user.userId,
            dto.taskDescription,
        );
    }

    @Get('insights')
    async insights(@Req() req) {
        return this.aiOrchestratorService.generateInsights(req.user.userId);
    }
}
