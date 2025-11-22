import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksRepository {
    constructor(private prisma: PrismaService) { }

    async findAllByUserId(userId: string) {
        return this.prisma.task.findMany({
            where: { userId },
            include: {
                project: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findByProjectId(projectId: string) {
        return this.prisma.task.findMany({
            where: { projectId },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async findById(id: string) {
        return this.prisma.task.findUnique({
            where: { id },
            include: {
                project: true,
            },
        });
    }

    async create(
        userId: string,
        projectId: string,
        data: {
            name: string;
            humanTime: number;
            aiTime: number;
        },
    ) {
        return this.prisma.task.create({
            data: {
                ...data,
                userId,
                projectId,
            },
            include: {
                project: true,
            },
        });
    }

    async update(
        id: string,
        data: {
            name?: string;
            humanTime?: number;
            aiTime?: number;
        },
    ) {
        return this.prisma.task.update({
            where: { id },
            data,
            include: {
                project: true,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.task.delete({
            where: { id },
        });
    }
}
