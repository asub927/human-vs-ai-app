import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { handleError } from '@/lib/middleware/error'
import { projectsRepository } from '@/lib/data/projects.repository'
import { updateProjectSchema } from '@/lib/schemas/api.schemas'

// GET /api/projects/[id] - Get a single project
export const GET = withAuth(
    async (req: NextRequest, userId: string, { params }: { params: { id: string } }) => {
        try {
            const project = await projectsRepository.findById(params.id)

            if (!project) {
                return NextResponse.json(
                    { error: 'Project not found' },
                    { status: 404 }
                )
            }

            // Verify ownership
            if (project.userId !== userId) {
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }

            return NextResponse.json(project)
        } catch (error) {
            return handleError(error)
        }
    }
)

// PUT /api/projects/[id] - Update a project
export const PUT = withAuth(
    async (req: NextRequest, userId: string, { params }: { params: { id: string } }) => {
        return withValidation(
            updateProjectSchema,
            async (req, data) => {
                try {
                    const project = await projectsRepository.findById(params.id)

                    if (!project) {
                        return NextResponse.json(
                            { error: 'Project not found' },
                            { status: 404 }
                        )
                    }

                    // Verify ownership
                    if (project.userId !== userId) {
                        return NextResponse.json(
                            { error: 'Forbidden' },
                            { status: 403 }
                        )
                    }

                    const updated = await projectsRepository.update(params.id, data)
                    return NextResponse.json(updated)
                } catch (error) {
                    return handleError(error)
                }
            }
        )(req, userId)
    }
)

// DELETE /api/projects/[id] - Delete a project
export const DELETE = withAuth(
    async (req: NextRequest, userId: string, { params }: { params: { id: string } }) => {
        try {
            const project = await projectsRepository.findById(params.id)

            if (!project) {
                return NextResponse.json(
                    { error: 'Project not found' },
                    { status: 404 }
                )
            }

            // Verify ownership
            if (project.userId !== userId) {
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }

            await projectsRepository.delete(params.id)
            return NextResponse.json({ success: true })
        } catch (error) {
            return handleError(error)
        }
    }
)
