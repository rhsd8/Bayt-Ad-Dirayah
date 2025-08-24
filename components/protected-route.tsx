"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface UnauthorizedPageProps {
  lang: string
}

function UnauthorizedPage({ lang }: UnauthorizedPageProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">401</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">Unauthorized Access</h2>
          <p className="text-muted-foreground">
            You need to sign in to access this page.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push(`/${lang}/login`)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push(`/${lang}/signup`)}
            className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push(`/${lang}`)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}

interface ProtectedRouteProps {
  children: React.ReactNode
  lang: string
}

export function ProtectedRoute({ children, lang }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <UnauthorizedPage lang={lang} />
  }

  return <>{children}</>
}