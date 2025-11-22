import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: {
        email: string;
        name?: string;
        provider: string;
        providerId: string;
    }) {
        return this.prisma.user.create({
            data,
        });
    }

    async update(id: string, data: { name?: string; email?: string }) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async findOrCreate(data: {
        email: string;
        name?: string;
        provider: string;
        providerId: string;
    }) {
        const existingUser = await this.findByEmail(data.email);
        if (existingUser) {
            return existingUser;
        }
        return this.create(data);
    }
}
