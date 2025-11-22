import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from '../../process/services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    async findAll(@Req() req) {
        return this.tasksService.getAllTasks(req.user.userId);
    }

    @Get('project/:projectId')
    async findByProject(@Param('projectId') projectId: string) {
        return this.tasksService.getTasksByProject(projectId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    async create(@Body() dto: CreateTaskDto, @Req() req) {
        return this.tasksService.createTask(
            req.user.userId,
            dto.projectId,
            {
                name: dto.name,
                humanTime: dto.humanTime,
                aiTime: dto.aiTime,
            },
        );
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.updateTask(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.tasksService.deleteTask(id);
    }
}
