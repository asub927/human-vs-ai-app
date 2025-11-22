import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { withValidation } from '@/lib/middleware/validation'
import { handleError } from '@/lib/middleware/error'
import { tasksRepository } from '@/lib/data/tasks.repository'
import { updateTaskSchema } from '@/lib/schemas/api.schemas'

// GET /api/tasks/[id] - Get a single task
export const GET = withAuth(
    async (req: NextRequest, userId: string, { params }: { params: { id: string } }) => {
        try {
            const task = await tasksRepository.findById(params.id)

            if (!task) {
                return NextResponse.json(
                    { error: 'Task not found' },
                    { status: 404 }
                )
            }

            // Verify ownership
            if (task.userId !== userId) {
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }

            return NextResponse.json(task)
        } catch (error) {
            return handleError(error)
        }
    }
)

// PUT /api/tasks/[id] - Update a task
export const PUT = withAuth(
    async (req: NextRequest, userId: string, { params }: { params: { id: string } }) => {
        return withValidation(
            updateTaskSchema,
            async (req, data) => {
                try {
                    const task = await tasksRepository.findById(params.id)

                    if (!task) {
                        return NextResponse.json(
                            { error: 'Task not found' },
                            { status: 404 }
                        )
                    }

                    // Verify ownership
                    if (task.userId !== userId) {
                        return NextResponse.json(
                            { error: 'Forbidden' },
                            { status: 403 }
                        )
                    }

                    const updated = await tasksRepository.update(params.id, data)
                    return NextResponse.json(updated)
                } catch (error) {
                    return handleError(error)
                }
            }
        )(req, userId)
    }
)

// DELETE /api/tasks/[id] - Delete a task
export const DELETE = withAuth(
    async (req: NextRequest, userId: string, { params }: { params: { id: string } }) => {
        try {
            const task = await tasksRepository.findById(params.id)

            if (!task) {
                return NextResponse.json(
                    { error: 'Task not found' },
                    { status: 404 }
                )
            }

            // Verify ownership
            if (task.userId !== userId) {
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }

            await tasksRepository.delete(params.id)
            return NextResponse.json({ success: true })
        } catch (error) {
            return handleError(error)
        }
    }
)
