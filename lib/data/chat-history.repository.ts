import prisma from '../prisma'

export const chatHistoryRepository = {
    async findByUserId(userId: string, limit: number = 50) {
        return prisma.chatHistory.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'asc',
            },
            take: limit,
        })
    },

    async create(userId: string, role: 'user' | 'assistant', message: string) {
        return prisma.chatHistory.create({
            data: {
                userId,
                role,
                message,
            },
        })
    },

    async deleteByUserId(userId: string) {
        return prisma.chatHistory.deleteMany({
            where: { userId },
        })
    },
}
