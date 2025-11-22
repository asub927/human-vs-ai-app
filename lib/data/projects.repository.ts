import prisma from '../prisma'

export const projectsRepository = {
    async findAllByUserId(userId: string) {
        return prisma.project.findMany({
            where: { userId },
            include: {
                tasks: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    },

    async findById(id: string) {
        return prisma.project.findUnique({
            where: { id },
            include: {
                tasks: true,
            },
        })
    },

    async create(userId: string, data: { name: string; initialTask?: string }) {
        return prisma.project.create({
            data: {
                name: data.name,
                userId,
                tasks: data.initialTask
                    ? {
                        create: {
                            name: data.initialTask,
                            humanTime: 0,
                            aiTime: 0,
                            userId,
                        },
                    }
                    : undefined,
            },
            include: {
                tasks: true,
            },
        })
    },

    async update(id: string, data: { name?: string }) {
        return prisma.project.update({
            where: { id },
            data,
        })
    },

    async delete(id: string) {
        return prisma.project.delete({
            where: { id },
        })
    },

    async getTaskCount(projectId: string) {
        return prisma.task.count({
            where: { projectId },
        })
    },
}
