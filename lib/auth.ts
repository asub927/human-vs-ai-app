import NextAuth, { NextAuthConfig } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import AppleProvider from 'next-auth/providers/apple'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { usersRepository } from './data/users.repository'

export const authConfig: NextAuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID!,
            clientSecret: process.env.APPLE_CLIENT_SECRET!,
        }),
        AzureADProvider({
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
            tenantId: process.env.MICROSOFT_TENANT_ID || 'common',
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!account || !user.email) {
                return false
            }

            try {
                // Create or update user in database
                await usersRepository.findOrCreate({
                    email: user.email,
                    name: user.name || null,
                    provider: account.provider,
                    providerId: account.providerAccountId,
                })
                return true
            } catch (error) {
                console.error('Error during sign in:', error)
                return false
            }
        },
        async jwt({ token, account, user }) {
            // Add user ID to token on first sign in
            if (account && user) {
                const dbUser = await usersRepository.findByEmail(user.email!)
                if (dbUser) {
                    token.userId = dbUser.id
                }
            }
            return token
        },
        async session({ session, token }) {
            // Add user ID to session
            if (token.userId) {
                session.user.id = token.userId as string
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
