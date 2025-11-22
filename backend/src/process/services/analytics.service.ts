import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../data/repositories/tasks.repository';
import { ProjectsRepository } from '../../data/repositories/projects.repository';

@Injectable()
export class AnalyticsService {
    constructor(
        private tasksRepository: TasksRepository,
        private projectsRepository: ProjectsRepository,
    ) { }

    async getOverview(userId: string) {
        const tasks = await this.tasksRepository.findAllByUserId(userId);
        const projects = await this.projectsRepository.findAllByUserId(userId);

        const totalTimeSaved = tasks.reduce(
            (sum, task) => sum + (task.humanTime - task.aiTime),
            0,
        );

        const avgProductivityGain =
            tasks.length > 0
                ? tasks.reduce((sum, task) => {
                    const gain = task.humanTime > 0
                        ? ((task.humanTime - task.aiTime) / task.humanTime) * 100
                        : 0;
                    return sum + gain;
                }, 0) / tasks.length
                : 0;

        return {
            totalTasks: tasks.length,
            totalProjects: projects.length,
            totalTimeSaved: Math.round(totalTimeSaved),
            avgProductivityGain: Math.round(avgProductivityGain * 10) / 10,
        };
    }

    async getByProject(userId: string) {
        const projects = await this.projectsRepository.findAllByUserId(userId);

        return projects.map((project) => {
            const tasks = project.tasks || [];
            const totalTimeSaved = tasks.reduce(
                (sum, task) => sum + (task.humanTime - task.aiTime),
                0,
            );

            const avgGain =
                tasks.length > 0
                    ? tasks.reduce((sum, task) => {
                        const gain = task.humanTime > 0
                            ? ((task.humanTime - task.aiTime) / task.humanTime) * 100
                            : 0;
                        return sum + gain;
                    }, 0) / tasks.length
                    : 0;

            return {
                projectId: project.id,
                projectName: project.name,
                taskCount: tasks.length,
                totalTimeSaved: Math.round(totalTimeSaved),
                avgProductivityGain: Math.round(avgGain * 10) / 10,
            };
        });
    }

    async getChartData(userId: string) {
        const tasks = await this.tasksRepository.findAllByUserId(userId);

        return tasks.map((task) => ({
            id: task.id,
            name: task.name,
            humanTime: task.humanTime,
            aiTime: task.aiTime,
            productivityGain: task.humanTime > 0
                ? ((task.humanTime - task.aiTime) / task.humanTime) * 100
                : 0,
            projectName: task.project?.name || 'Unknown',
        }));
    }
}
