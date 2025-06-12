// store/useAuthStore.ts
import { create } from 'zustand'
import { AuthState } from '../types/AuthType'

import { authClient } from '@/app/lib/auth-client'

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    fetchSession: async () => {
        set({ isLoading: true, error: null })
        try {
            const { data, error } = await authClient.getSession() // ou ta méthode pour récupérer session
            if (error) throw error
            set({ user: data?.user ?? null, isLoading: false })
        } catch (error: any) {
            set({ error, user: null, isLoading: false })
        }
    },

    clearSession: () => set({ user: null }),
}))
