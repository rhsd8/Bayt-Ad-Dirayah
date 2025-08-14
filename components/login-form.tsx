"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"

// Define the validation schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

interface LoginFormProps {
  lang: string
  dictionary: any
}

export function LoginForm({ lang, dictionary }: LoginFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setError(error.message)
    } else {
      // Redirect to the dashboard on successful login
      router.push(`/${lang}/dashboard`)
      router.refresh() // Refresh the page to update session state
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16">
            <Image src="/logo-web-dark.webp" alt="Logo" width={64} height={64} />
          </div>
          <CardTitle className="text-2xl font-bold">{dictionary.login.title}</CardTitle>
          <CardDescription>{dictionary.login.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.login.emailLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.login.emailPlaceholder} {...field} />
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
                    <FormLabel>{dictionary.login.passwordLabel}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={dictionary.login.passwordPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? dictionary.login.loading : dictionary.login.submit}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {dictionary.login.noAccount}{" "}
            <Link href={`/${lang}/signup`} className="underline">
              {dictionary.login.signUp}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}