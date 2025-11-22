import type { Metadata } from 'next'
import { Providers } from './providers'
import '../src/index.css'

export const metadata: Metadata = {
    title: 'AI Productivity Benchmark',
    description: 'Compare task completion times with and without AI',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
