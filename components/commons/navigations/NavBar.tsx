"use client"

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/contexts/authStore'
import { authClient } from '@/app/lib/auth-client'

const NavBar = () => {
    const router = useRouter()

    const { user, fetchSession, clearSession } = useAuthStore()

    useEffect(() => {
        fetchSession()
    }, [fetchSession])

    const handleLogOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    clearSession()
                    router.push("/account/sign-in")
                }
            }
        })
    }

    if (!user) return null 

    return (
        <div className="w-full pb-6">
            <p>{user.name}</p>
            <Button onClick={handleLogOut}>Se déconnecter</Button>
        </div>
    )
}

export default NavBar
