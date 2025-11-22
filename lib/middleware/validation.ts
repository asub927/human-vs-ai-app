import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema } from 'zod'

export function withValidation<T>(
    schema: ZodSchema<T>,
    handler: (req: NextRequest, data: T, userId?: string) => Promise<NextResponse>
) {
    return async (req: NextRequest, userId?: string) => {
        try {
            const body = await req.json()
            const validatedData = schema.parse(body)
            return handler(req, validatedData, userId)
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return NextResponse.json(
                    {
                        error: 'Validation failed',
                        details: error.errors,
                    },
                    { status: 400 }
                )
            }
            throw error
        }
    }
}
