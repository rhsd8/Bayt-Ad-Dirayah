"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authenticateAdmin } from "@/lib/admin-auth"

// Define the validation schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export function AdminLoginForm() {
  const router = useRouter()
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

    try {
      // Authenticate admin using Supabase
      const admin = await authenticateAdmin(values.email, values.password)
      
      if (admin) {
        // Store admin info in session storage or local storage
        sessionStorage.setItem('admin_user', JSON.stringify(admin))
        
        // Redirect to admin dashboard
        router.push("/admin")
        router.refresh()
      } else {
        setError("Invalid admin credentials")
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setError("Authentication failed. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Link href="/" aria-label="Bayt Ad Dirayah Home" title="Home" className="inline-flex items-center">
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
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">Administrator access only</p>
          </div>
        </div>

        {/* Admin Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter admin credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter admin email" {...field} />
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
                    <FormLabel>Admin Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter admin password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Access Admin Panel"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}