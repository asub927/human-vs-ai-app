import { z } from 'zod'

export const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    initialTask: z.string().optional(),
})

export const updateProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
})

export const createTaskSchema = z.object({
    projectId: z.string().uuid('Invalid project ID'),
    name: z.string().min(1, 'Task name is required'),
    humanTime: z.number().min(0, 'Human time must be positive'),
    aiTime: z.number().min(0, 'AI time must be positive'),
})

export const updateTaskSchema = z.object({
    name: z.string().min(1).optional(),
    humanTime: z.number().min(0).optional(),
    aiTime: z.number().min(0).optional(),
})
