import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repository';
import { ProjectsRepository } from './repositories/projects.repository';
import { TasksRepository } from './repositories/tasks.repository';
import { ChatHistoryRepository } from './repositories/chat-history.repository';

@Module({
    providers: [
        PrismaService,
        UsersRepository,
        ProjectsRepository,
        TasksRepository,
        ChatHistoryRepository,
    ],
    exports: [
        PrismaService,
        UsersRepository,
        ProjectsRepository,
        TasksRepository,
        ChatHistoryRepository,
    ],
})
export class DataModule { }
