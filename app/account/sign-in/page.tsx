"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/app/lib/auth-client"
import { useState } from "react"
import ResetPasswordForm from "@/components/commons/forms/ResetPasswordForm"

const formSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string(),
})

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const [showResetForm, setShowResetForm] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function resetPassword(email: string) {
        const { data, error } = await authClient.requestPasswordReset({
            email: email,
            redirectTo: "/reset-password",
        });
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { data, error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/",
            rememberMe: true

        }, {
            onRequest: (ctx) => {
                setIsLoading(true)
            },
            onSuccess: (ctx) => {
                console.log("Connexion réussie :", ctx.data)
            },
            onError: (ctx) => {
                alert(ctx.error.message);
            },
        }
        ).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <div className="w-full min-h-screen grid place-content-center relative">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Entrez votre email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Entrez votre mot de passe"
                                        {...field}
                                    />
                                </FormControl>
                                <p>
                                    Mot de passe oublié ?{" "}
                                    <span
                                        className="font-bold text-primary cursor-pointer"
                                        onClick={() => setShowResetForm(true)}
                                    >
                                        Réinitialiser
                                    </span>
                                </p>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="flex items-center gap-2">
                        {
                            isLoading ? (
                                <>
                                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <span>Se connecter</span>
                            )
                        }
                    </Button>
                </form>
            </Form>

            <AnimatePresence>
                {showResetForm && (
                    <motion.div
                        key="reset-form"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="grid place-content-center w-full h-full bg-white backdrop-blur-2xl absolute top-0 left-0 z-10"
                    >
                        <ResetPasswordForm />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
