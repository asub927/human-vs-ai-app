import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TasksRepository } from '../../data/repositories/tasks.repository';
import { ProjectsRepository } from '../../data/repositories/projects.repository';
import { ChatHistoryRepository } from '../../data/repositories/chat-history.repository';

@Injectable()
export class AiOrchestratorService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(
        private configService: ConfigService,
        private tasksRepository: TasksRepository,
        private projectsRepository: ProjectsRepository,
        private chatHistoryRepository: ChatHistoryRepository,
    ) {
        const apiKey = this.configService.get('GEMINI_API_KEY');
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
        });
    }

    async chat(userId: string, message: string) {
        // Get user context
        const tasks = await this.tasksRepository.findAllByUserId(userId);
        const projects = await this.projectsRepository.findAllByUserId(userId);
        const history = await this.chatHistoryRepository.findByUserId(userId, 10);

        // Build context
        const context = this.buildContext(tasks, projects);

        // Build conversation history
        const conversationHistory = history.map((h) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.message }],
        }));

        // Add current message
        conversationHistory.push({
            role: 'user',
            parts: [{ text: message }],
        });

        // Generate response
        const chat = this.model.startChat({
            history: conversationHistory.slice(0, -1),
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
            },
        });

        const systemPrompt = `You are a helpful AI assistant for productivity tracking.

User Context:
${context}

You can help users:
- Add tasks and projects
- Analyze their productivity data
- Answer questions about their work patterns
- Provide recommendations

Be concise and actionable in your responses.`;

        const result = await chat.sendMessage(systemPrompt + '\n\nUser: ' + message);
        const response = result.response.text();

        // Save to chat history
        await this.chatHistoryRepository.create(userId, 'user', message);
        await this.chatHistoryRepository.create(userId, 'assistant', response);

        return {
            message: response,
            timestamp: new Date().toISOString(),
        };
    }

    async estimateTask(userId: string, taskDescription: string) {
        // Get user's historical data
        const tasks = await this.tasksRepository.findAllByUserId(userId);

        const prompt = `You are a time estimation specialist.

Analyze this task description and provide estimates:
Task: "${taskDescription}"

User's historical data:
${JSON.stringify(tasks.slice(0, 10), null, 2)}

Provide estimates in JSON format:
{
  "humanTime": number (in minutes),
  "aiTime": number (in minutes),
  "confidence": number (0-100),
  "category": string,
  "reasoning": string
}`;

        const result = await this.model.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Failed to parse estimation response');
    }

    async generateInsights(userId: string) {
        const tasks = await this.tasksRepository.findAllByUserId(userId);
        const projects = await this.projectsRepository.findAllByUserId(userId);

        const prompt = `You are a productivity insights analyst.

Analyze this user's data and provide insights:

Tasks: ${JSON.stringify(tasks, null, 2)}
Projects: ${JSON.stringify(projects, null, 2)}

Provide insights in JSON format:
{
  "patterns": string[],
  "topAITasks": [{ "task": string, "gain": number }],
  "totalTimeSaved": number,
  "recommendations": string[],
  "trends": [{ "period": string, "metric": string, "value": number }]
}`;

        const result = await this.model.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Failed to parse insights response');
    }

    private buildContext(tasks: any[], projects: any[]): string {
        const totalTasks = tasks.length;
        const totalProjects = projects.length;
        const totalTimeSaved = tasks.reduce(
            (sum, task) => sum + (task.humanTime - task.aiTime),
            0,
        );

        return `
Total Projects: ${totalProjects}
Total Tasks: ${totalTasks}
Total Time Saved: ${Math.round(totalTimeSaved)} minutes

Recent Tasks:
${tasks.slice(0, 5).map((t) => `- ${t.name}: ${t.humanTime}min (human) vs ${t.aiTime}min (AI)`).join('\n')}
`;
    }
}
