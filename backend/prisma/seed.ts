import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs'; // You might need to install this if not present, or use another hashing method for seed

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // Cleanup existing data
    await prisma.chatHistory.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    // Create demo user
    const demoUser = await prisma.user.create({
        data: {
            email: 'demo@example.com',
            name: 'Demo User',
            provider: 'local',
            providerId: 'demo-123',
        },
    });

    console.log(`👤 Created user: ${demoUser.email}`);

    // Create projects
    const project1 = await prisma.project.create({
        data: {
            name: 'Website Redesign',
            userId: demoUser.id,
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'Mobile App Launch',
            userId: demoUser.id,
        },
    });

    console.log(`📁 Created projects: ${project1.name}, ${project2.name}`);

    // Create tasks for Project 1
    await prisma.task.createMany({
        data: [
            {
                name: 'Design Homepage',
                humanTime: 120,
                aiTime: 30,
                projectId: project1.id,
                userId: demoUser.id,
            },
            {
                name: 'Implement Navigation',
                humanTime: 60,
                aiTime: 10,
                projectId: project1.id,
                userId: demoUser.id,
            },
            {
                name: 'Write Content',
                humanTime: 180,
                aiTime: 20,
                projectId: project1.id,
                userId: demoUser.id,
            },
        ],
    });

    // Create tasks for Project 2
    await prisma.task.createMany({
        data: [
            {
                name: 'Setup React Native',
                humanTime: 90,
                aiTime: 15,
                projectId: project2.id,
                userId: demoUser.id,
            },
            {
                name: 'Build Login Screen',
                humanTime: 150,
                aiTime: 25,
                projectId: project2.id,
                userId: demoUser.id,
            },
        ],
    });

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
