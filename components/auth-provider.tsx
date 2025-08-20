"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "student" | "teacher"
  avatar?: string
  preferences?: {
    language: string
    theme: string
    notifications: boolean
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

// Helper to construct our User from Supabase session user
function mapSupabaseUser(sessionUser: any): User {
  const metadata = sessionUser?.user_metadata || {}
  const email: string = sessionUser?.email || ""
  const localPart = email ? email.split("@")[0] : ""
  const fullName: string =
    metadata.full_name || metadata.fullName || metadata.name || metadata.given_name || metadata.first_name || ""
  const name = (fullName || localPart || "").toString()
  const role = (metadata.role as User["role"]) || "student"
  return {
    id: sessionUser?.id,
    name,
    email,
    role,
    avatar: metadata.avatar_url || metadata.avatar || undefined,
    preferences: metadata.preferences || undefined,
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize Supabase session and subscribe to auth changes
  useEffect(() => {
    let mounted = true
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        if (session?.user) {
          setUser(mapSupabaseUser(session.user))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Supabase getSession error:", error)
        setUser(null)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (session?.user) {
        setUser(mapSupabaseUser(session.user))
      } else {
        setUser(null)
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { success: false, error: error.message }
      }
      if (data.session?.user) {
        setUser(mapSupabaseUser(data.session.user))
      }
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null
      const updatedUser = { ...prevUser, ...updates }
      // Persisting custom profile fields to Supabase would be implemented here if needed.
      return updatedUser
    })
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
