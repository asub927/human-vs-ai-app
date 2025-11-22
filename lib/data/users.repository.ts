import prisma from '../prisma'

export const usersRepository = {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        })
    },

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
        })
    },

    async findOrCreate(data: {
        email: string
        name: string | null
        provider: string
        providerId: string
    }) {
        const existing = await prisma.user.findUnique({
            where: {
                provider_providerId: {
                    provider: data.provider,
                    providerId: data.providerId,
                },
            },
        })

        if (existing) {
            return existing
        }

        return prisma.user.create({
            data,
        })
    },

    async update(id: string, data: { name?: string; email?: string }) {
        return prisma.user.update({
            where: { id },
            data,
        })
    },
}
