import prisma from '../prisma'

export const tasksRepository = {
    async findAllByUserId(userId: string) {
        return prisma.task.findMany({
            where: { userId },
            include: {
                project: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    },

    async findByProjectId(projectId: string) {
        return prisma.task.findMany({
            where: { projectId },
            orderBy: {
                createdAt: 'asc',
            },
        })
    },

    async findById(id: string) {
        return prisma.task.findUnique({
            where: { id },
            include: {
                project: true,
            },
        })
    },

    async create(
        userId: string,
        projectId: string,
        data: {
            name: string
            humanTime: number
            aiTime: number
        }
    ) {
        return prisma.task.create({
            data: {
                ...data,
                userId,
                projectId,
            },
            include: {
                project: true,
            },
        })
    },

    async update(
        id: string,
        data: {
            name?: string
            humanTime?: number
            aiTime?: number
        }
    ) {
        return prisma.task.update({
            where: { id },
            data,
        })
    },

    async delete(id: string) {
        return prisma.task.delete({
            where: { id },
        })
    },
}
