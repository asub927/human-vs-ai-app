import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from '../../data/repositories/projects.repository';

@Injectable()
export class ProjectsService {
    constructor(private projectsRepository: ProjectsRepository) { }

    async getAllProjects(userId: string) {
        return this.projectsRepository.findAllByUserId(userId);
    }

    async getProjectById(id: string) {
        return this.projectsRepository.findById(id);
    }

    async createProject(
        userId: string,
        data: { name: string; taskNames?: string[] },
    ) {
        // Business logic: validate project name
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Project name cannot be empty');
        }

        return this.projectsRepository.create(userId, data);
    }

    async addTaskDefinition(projectId: string, taskName: string) {
        if (!taskName || taskName.trim().length === 0) {
            throw new Error('Task name cannot be empty');
        }
        return this.projectsRepository.addTaskDefinition(projectId, taskName);
    }

    async removeTaskDefinition(projectId: string, taskName: string) {
        return this.projectsRepository.removeTaskDefinition(projectId, taskName);
    }

    async updateProject(id: string, data: { name?: string }) {
        if (data.name && data.name.trim().length === 0) {
            throw new Error('Project name cannot be empty');
        }

        return this.projectsRepository.update(id, data);
    }

    async deleteProject(id: string) {
        return this.projectsRepository.delete(id);
    }
}
