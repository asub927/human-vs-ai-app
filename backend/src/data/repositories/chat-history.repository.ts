import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatHistoryRepository {
    constructor(private prisma: PrismaService) { }

    async findByUserId(userId: string, limit = 50) {
        return this.prisma.chatHistory.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'asc',
            },
            take: limit,
        });
    }

    async create(userId: string, role: string, message: string) {
        return this.prisma.chatHistory.create({
            data: {
                userId,
                role,
                message,
            },
        });
    }

    async deleteByUserId(userId: string) {
        return this.prisma.chatHistory.deleteMany({
            where: { userId },
        });
    }
}
