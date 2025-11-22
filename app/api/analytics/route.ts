import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { handleError } from '@/lib/middleware/error'
import { tasksRepository } from '@/lib/data/tasks.repository'
import { projectsRepository } from '@/lib/data/projects.repository'

// GET /api/analytics - Get analytics data for the authenticated user
export const GET = withAuth(async (req: NextRequest, userId: string) => {
    try {
        const tasks = await tasksRepository.findAllByUserId(userId)
        const projects = await projectsRepository.findAllByUserId(userId)

        // Calculate analytics
        const totalTasks = tasks.length
        const totalProjects = projects.length

        // Calculate productivity gain
        const totalHumanTime = tasks.reduce((sum, task) => sum + task.humanTime, 0)
        const totalAiTime = tasks.reduce((sum, task) => sum + task.aiTime, 0)
        const totalTimeSaved = totalHumanTime - totalAiTime
        const avgProductivityGain = totalHumanTime > 0
            ? (totalHumanTime / totalAiTime)
            : 0

        // Group by project
        const byProject = projects.map(project => {
            const projectTasks = tasks.filter(task => task.projectId === project.id)
            const humanTime = projectTasks.reduce((sum, task) => sum + task.humanTime, 0)
            const aiTime = projectTasks.reduce((sum, task) => sum + task.aiTime, 0)

            return {
                projectId: project.id,
                projectName: project.name,
                taskCount: projectTasks.length,
                humanTime,
                aiTime,
                timeSaved: humanTime - aiTime,
                productivityGain: humanTime > 0 ? humanTime / aiTime : 0,
            }
        })

        // Prepare chart data
        const chartData = tasks.map(task => ({
            id: task.id,
            name: task.name,
            projectName: task.project.name,
            humanTime: task.humanTime,
            aiTime: task.aiTime,
            timeSaved: task.humanTime - task.aiTime,
            productivityGain: task.humanTime > 0 ? task.humanTime / task.aiTime : 0,
        }))

        return NextResponse.json({
            overview: {
                totalTasks,
                totalProjects,
                totalHumanTime,
                totalAiTime,
                totalTimeSaved,
                avgProductivityGain,
            },
            byProject,
            chartData,
        })
    } catch (error) {
        return handleError(error)
    }
})
