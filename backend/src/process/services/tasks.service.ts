import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../data/repositories/tasks.repository';

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TasksRepository) { }

    async getAllTasks(userId: string) {
        return this.tasksRepository.findAllByUserId(userId);
    }

    async getTasksByProject(projectId: string) {
        return this.tasksRepository.findByProjectId(projectId);
    }

    async getTaskById(id: string) {
        return this.tasksRepository.findById(id);
    }

    async createTask(
        userId: string,
        projectId: string,
        data: {
            name: string;
            humanTime: number;
            aiTime: number;
        },
    ) {
        // Business logic: validate task data
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Task name cannot be empty');
        }

        if (data.humanTime < 0 || data.aiTime < 0) {
            throw new Error('Time values must be positive');
        }

        return this.tasksRepository.create(userId, projectId, data);
    }

    async updateTask(
        id: string,
        data: {
            name?: string;
            humanTime?: number;
            aiTime?: number;
        },
    ) {
        if (data.name && data.name.trim().length === 0) {
            throw new Error('Task name cannot be empty');
        }

        if (
            (data.humanTime !== undefined && data.humanTime < 0) ||
            (data.aiTime !== undefined && data.aiTime < 0)
        ) {
            throw new Error('Time values must be positive');
        }

        return this.tasksRepository.update(id, data);
    }

    async deleteTask(id: string) {
        return this.tasksRepository.delete(id);
    }
}
