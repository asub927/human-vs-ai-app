import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function withAuth(
    handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
    return async (req: NextRequest) => {
        const session = await auth()

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        return handler(req, session.user.id)
    }
}
