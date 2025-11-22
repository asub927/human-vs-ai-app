import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { handleError } from '@/lib/middleware/error'
import { projectsRepository } from '@/lib/data/projects.repository'
import { createProjectSchema } from '@/lib/schemas/api.schemas'

// GET /api/projects - List all projects for the authenticated user
export const GET = withAuth(async (req: NextRequest, userId: string) => {
    try {
        const projects = await projectsRepository.findAllByUserId(userId)
        return NextResponse.json(projects)
    } catch (error) {
        return handleError(error)
    }
})

// POST /api/projects - Create a new project
export const POST = withAuth(
    async (req: NextRequest, userId: string) => {
        return withValidation(
            createProjectSchema,
            async (req, data) => {
                try {
                    const project = await projectsRepository.create(userId, {
                        name: data.name,
                        initialTask: data.initialTask,
                    })
                    return NextResponse.json(project, { status: 201 })
                } catch (error) {
                    return handleError(error)
                }
            }
        )(req, userId)
    }
)
