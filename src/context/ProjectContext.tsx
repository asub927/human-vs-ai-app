

import React, { createContext, useContext, ReactNode } from 'react';
import { Project, TaskData } from '../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ProjectContextType {
    projects: Project[];
    chartData: TaskData[];
    addProject: (name: string, initialTask: string) => void;
    deleteProject: (id: string) => void;
    addTaskToProject: (projectId: string, taskName: string) => void;
    deleteTaskFromProject: (projectId: string, taskName: string) => void;
    addChartData: (data: TaskData) => void;
    deleteChartData: (index: number) => void;
    clearChartData: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Fetch Projects
    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            if (!token) return [];
            const res = await axios.get(`${API_URL}/projects`, { headers });
            // Map backend response: backend Project has taskNames, frontend expects tasks (string[])
            return res.data.map((p: any) => ({
                ...p,
                tasks: p.taskNames || []
            }));
        },
        enabled: !!token
    });

    // Fetch Chart Data (Tasks)
    const { data: chartData = [] } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            if (!token) return [];
            const res = await axios.get(`${API_URL}/tasks`, { headers });
            // Map backend Task to TaskData
            return res.data.map((t: any) => ({
                id: t.id,
                projectName: t.project?.name || 'Unknown',
                task: t.name,
                humanTime: t.humanTime,
                aiTime: t.aiTime
            }));
        },
        enabled: !!token
    });

    // Mutations
    const addProjectMutation = useMutation({
        mutationFn: async ({ name, initialTask }: { name: string, initialTask: string }) => {
            await axios.post(`${API_URL}/projects`, { name, taskNames: [initialTask] }, { headers });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
    });

    const deleteProjectMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${API_URL}/projects/${id}`, { headers });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
    });

    const addTaskToProjectMutation = useMutation({
        mutationFn: async ({ projectId, taskName }: { projectId: string, taskName: string }) => {
            // Using a specific endpoint for adding task definition
            await axios.post(`${API_URL}/projects/${projectId}/tasks/definition`, { name: taskName }, { headers });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
    });

    const deleteTaskFromProjectMutation = useMutation({
        mutationFn: async ({ projectId, taskName }: { projectId: string, taskName: string }) => {
            await axios.delete(`${API_URL}/projects/${projectId}/tasks/definition/${encodeURIComponent(taskName)}`, { headers });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
    });

    const addChartDataMutation = useMutation({
        mutationFn: async (data: TaskData) => {
            // Find project by name to get ID
            const project = projects.find((p: Project) => p.name === data.projectName);
            if (!project) throw new Error(`Project '${data.projectName}' not found`);

            await axios.post(`${API_URL}/tasks`, {
                name: data.task,
                humanTime: data.humanTime,
                aiTime: data.aiTime,
                projectId: project.id
            }, { headers });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
    });

    const deleteChartDataMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${API_URL}/tasks/${id}`, { headers });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
    });

    const clearChartDataMutation = useMutation({
        mutationFn: async () => {
            await axios.delete(`${API_URL}/tasks`, { headers });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
    });

    // Wrappers
    const addProject = (name: string, initialTask: string) => addProjectMutation.mutate({ name, initialTask });
    const deleteProject = (id: string) => deleteProjectMutation.mutate(id);
    const addTaskToProject = (projectId: string, taskName: string) => addTaskToProjectMutation.mutate({ projectId, taskName });
    const deleteTaskFromProject = (projectId: string, taskName: string) => deleteTaskFromProjectMutation.mutate({ projectId, taskName });
    const addChartData = (data: TaskData) => addChartDataMutation.mutate(data);

    const deleteChartData = (index: number) => {
        const task = chartData[index];
        if (task && task.id) {
            deleteChartDataMutation.mutate(task.id);
        }
    };

    const clearChartData = () => clearChartDataMutation.mutate();

    return (
        <ProjectContext.Provider value={{
            projects,
            chartData,
            addProject,
            deleteProject,
            addTaskToProject,
            deleteTaskFromProject,
            addChartData,
            deleteChartData,
            clearChartData
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
