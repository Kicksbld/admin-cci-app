export type User = {
    name: string;
    email: string;
  }
  
export type AuthState = {
    user: User | null
    isLoading: boolean
    error: Error | null
    fetchSession: () => Promise<void>
    clearSession: () => void
  }