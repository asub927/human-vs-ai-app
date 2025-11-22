import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectsRepository {
    constructor(private prisma: PrismaService) { }

    async findAllByUserId(userId: string) {
        return this.prisma.project.findMany({
            where: { userId },
            include: {
                tasks: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findById(id: string) {
        return this.prisma.project.findUnique({
            where: { id },
            include: {
                tasks: true,
            },
        });
    }

    async create(userId: string, data: { name: string; taskNames?: string[] }) {
        return this.prisma.project.create({
            data: {
                name: data.name,
                userId,
                taskNames: data.taskNames || [],
            },
            include: {
                tasks: true,
            },
        });
    }

    async addTaskDefinition(projectId: string, taskName: string) {
        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                taskNames: {
                    push: taskName
                }
            }
        });
    }

    async removeTaskDefinition(projectId: string, taskName: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) throw new Error('Project not found');

        const newNames = project.taskNames.filter(n => n !== taskName);

        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                taskNames: newNames
            }
        });
    }

    async update(id: string, data: { name?: string }) {
        return this.prisma.project.update({
            where: { id },
            data,
            include: {
                tasks: true,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.project.delete({
            where: { id },
        });
    }

    async getTaskCount(projectId: string): Promise<number> {
        return this.prisma.task.count({
            where: { projectId },
        });
    }
}
