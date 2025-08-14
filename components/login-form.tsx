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
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Link href={`/${lang}`} aria-label="Bayt Ad Dirayah Home" title="Home" className="inline-flex items-center">
              <Image
                src="/logo-web-light.webp"
                alt="Bayt Ad Dirayah"
                width={140}
                height={32}
                className="h-10 w-auto dark:hidden"
                priority
              />
              <Image
                src="/logo-web-dark.webp"
                alt="Bayt Ad Dirayah"
                width={140}
                height={32}
                className="h-10 w-auto hidden dark:inline"
                priority
              />
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{dictionary.auth.welcome}</h1>
            <p className="text-muted-foreground">Sign in to continue your learning journey</p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.auth.loginTitle}</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.auth.email}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                    <FormLabel>{dictionary.auth.password}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : dictionary.auth.loginButton}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href={`/${lang}/signup`} className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Back to Home */}
        <div className="text-center">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← {dictionary.auth.backToHome || "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  )
}