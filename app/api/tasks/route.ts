import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { handleError } from '@/lib/middleware/error'
import { tasksRepository } from '@/lib/data/tasks.repository'
import { createTaskSchema } from '@/lib/schemas/api.schemas'

// GET /api/tasks - List all tasks for the authenticated user
export const GET = withAuth(async (req: NextRequest, userId: string) => {
    try {
        const { searchParams } = new URL(req.url)
        const projectId = searchParams.get('projectId')

        let tasks
        if (projectId) {
            tasks = await tasksRepository.findByProjectId(projectId)
        } else {
            tasks = await tasksRepository.findAllByUserId(userId)
        }

        return NextResponse.json(tasks)
    } catch (error) {
        return handleError(error)
    }
})

// POST /api/tasks - Create a new task
export const POST = withAuth(
    async (req: NextRequest, userId: string) => {
        return withValidation(
            createTaskSchema,
            async (req, data) => {
                try {
                    const task = await tasksRepository.create(userId, data.projectId, {
                        name: data.name,
                        humanTime: data.humanTime,
                        aiTime: data.aiTime,
                    })
                    return NextResponse.json(task, { status: 201 })
                } catch (error) {
                    return handleError(error)
                }
            }
        )(req, userId)
    }
)
