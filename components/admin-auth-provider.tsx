"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminUser } from '@/lib/admin-auth'

interface AdminAuthContextType {
  admin: AdminUser | null
  isLoading: boolean
  login: (admin: AdminUser) => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in on mount
    const storedAdmin = sessionStorage.getItem('admin_user')
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin)
        setAdmin(parsedAdmin)
      } catch (error) {
        console.error('Error parsing stored admin data:', error)
        sessionStorage.removeItem('admin_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (adminUser: AdminUser) => {
    setAdmin(adminUser)
    sessionStorage.setItem('admin_user', JSON.stringify(adminUser))
  }

  const logout = () => {
    setAdmin(null)
    sessionStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

// Higher-order component for protecting admin routes
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AdminProtectedComponent(props: P) {
    const { admin, isLoading } = useAdminAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !admin) {
        router.push('/admin/login')
      }
    }, [admin, isLoading, router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      )
    }

    if (!admin) {
      return null
    }

    return <Component {...props} />
  }
}