"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ArrowLeft, BookOpen, AlertCircle } from "lucide-react"

interface LoginFormProps {
  lang: string
  dictionary: any
}

export function LoginForm({ lang, dictionary }: LoginFormProps) {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Basic validation
      if (!formData.email.trim() || !formData.password.trim()) {
        setError("Please fill in all fields")
        return
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email address")
        return
      }

      const result = await login(formData.email, formData.password)

      if (result.success) {
        router.push(`/${lang}/dashboard`)
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleBackToHome = () => {
    router.push(`/${lang}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{dictionary?.auth?.welcome || "Welcome to Arabic Learning Platform"}</h1>
            <p className="text-muted-foreground">Sign in to continue your learning journey</p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>{dictionary?.auth?.loginTitle || "Sign In"}</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{dictionary?.auth?.email || "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{dictionary?.auth?.password || "Password"}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoadingSpinner size="sm" text="Signing in..." />
                ) : (
                  dictionary?.auth?.loginButton || "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Demo Credentials:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>
                  <strong>Admin:</strong> admin@example.com / admin123
                </div>
                <div>
                  <strong>Student:</strong> student@example.com / student123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button variant="ghost" onClick={handleBackToHome} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {dictionary?.auth?.backToHome || "Back to Home"}
          </Button>
        </div>
      </div>
    </div>
  )
}
