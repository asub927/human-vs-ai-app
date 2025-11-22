import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { handleError } from '@/lib/middleware/error'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { chatHistoryRepository } from '@/lib/data/chat-history.repository'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// POST /api/ai/chat - Chat with AI assistant
export const POST = withAuth(async (req: NextRequest, userId: string) => {
    try {
        const { message } = await req.json()

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        // Get conversation history
        const history = await chatHistoryRepository.findByUserId(userId, 10)

        // Build conversation context
        const conversationHistory = history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.message }],
        }))

        // Add current message
        conversationHistory.push({
            role: 'user',
            parts: [{ text: message }],
        })

        // Generate response
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
        const chat = model.startChat({
            history: conversationHistory.slice(0, -1),
        })

        const result = await chat.sendMessage(message)
        const response = result.response.text()

        // Save to history
        await chatHistoryRepository.create(userId, 'user', message)
        await chatHistoryRepository.create(userId, 'assistant', response)

        return NextResponse.json({ message: response })
    } catch (error) {
        return handleError(error)
    }
})

// GET /api/ai/chat - Get chat history
export const GET = withAuth(async (req: NextRequest, userId: string) => {
    try {
        const history = await chatHistoryRepository.findByUserId(userId, 50)
        return NextResponse.json(history)
    } catch (error) {
        return handleError(error)
    }
})
