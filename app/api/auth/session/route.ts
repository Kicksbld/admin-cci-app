// app/api/auth/session/route.ts
import { NextResponse } from 'next/server'
import { authClient } from '@/app/lib/auth-client'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const { data: session, error } = await authClient.getSession()

        if (error || !session?.user?.id) {
            return NextResponse.json({ user: null, error: 'No session' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                role: true,
                banned: true,
                banReason: true,
                banExpires: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        if (!user) {
            return NextResponse.json({ user: null, error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (err: any) {
        return NextResponse.json({ user: null, error: err.message }, { status: 500 })
    }
}
