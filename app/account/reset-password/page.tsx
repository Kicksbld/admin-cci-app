'use client'

import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { authClient } from '@/app/lib/auth-client'

const formSchema = z.object({
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

const ResetPasswordPage = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setErrorMsg(null)

    try {
      if (!token) {
        setErrorMsg('Token de réinitialisation manquant.')
        return
      }

      const { data, error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      })

      if (error) {
        setErrorMsg(error.message ?? "Une erreur inconnue est survenue.")
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setErrorMsg('Une erreur est survenue.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 space-y-4">
      <h1 className="text-2xl font-semibold">Réinitialiser le mot de passe</h1>

      {success ? (
        <>
          <p className="text-green-600">Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.</p>
          <Button onClick={() => router.push("/account/sign-in")}>Se connecter</Button>
        </>

      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMsg && <p className="text-red-600">{errorMsg}</p>}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ResetPasswordPage
