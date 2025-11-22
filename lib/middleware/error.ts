import { NextResponse } from 'next/server'

export function handleError(error: unknown) {
    console.error('API Error:', error)

    if (error instanceof Error) {
        // Known error types
        if (error.message.includes('not found')) {
            return NextResponse.json(
                { error: 'Resource not found' },
                { status: 404 }
            )
        }

        if (error.message.includes('unauthorized')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (error.message.includes('forbidden')) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        // Generic error
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    // Unknown error
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
}
