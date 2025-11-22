import { Module } from '@nestjs/common';
import { ProcessModule } from '../process/process.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectsController } from './controllers/projects.controller';
import { TasksController } from './controllers/tasks.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { AiController } from './controllers/ai.controller';

@Module({
    imports: [ProcessModule, AuthModule],
    controllers: [
        ProjectsController,
        TasksController,
        AnalyticsController,
        AiController,
    ],
})
export class ExperienceModule { }
