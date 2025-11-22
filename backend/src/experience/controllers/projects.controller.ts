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
import { ProjectsService } from '../../process/services/projects.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Get()
    async findAll(@Req() req) {
        return this.projectsService.getAllProjects(req.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.projectsService.getProjectById(id);
    }

    @Post()
    async create(@Body() dto: CreateProjectDto, @Req() req) {
        return this.projectsService.createProject(req.user.userId, dto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
        return this.projectsService.updateProject(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.projectsService.deleteProject(id);
    }

    @Post(':id/tasks/definition')
    async addTaskDefinition(@Param('id') id: string, @Body('name') name: string) {
        return this.projectsService.addTaskDefinition(id, name);
    }

    @Delete(':id/tasks/definition/:name')
    async removeTaskDefinition(@Param('id') id: string, @Param('name') name: string) {
        return this.projectsService.removeTaskDefinition(id, decodeURIComponent(name));
    }
}
