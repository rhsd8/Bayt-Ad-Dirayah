"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { AppLayout } from "@/components/app-layout"
import { SkeletonCard } from "@/components/loading-spinner"
import { ErrorBoundary } from "@/components/error-boundary"
import { WipNoticeCard } from "@/components/wip-notice"
import { Dictionary } from "@/lib/dictionary"

interface DashboardStats {
  totalCourses: number
  completedCourses: number
  totalLessons: number
  completedLessons: number
  studyTime: number
  currentStreak: number
  achievements: number
  rank: number
}





interface DashboardProps {
  lang: string
  dictionary: Dictionary
}

export function Dashboard({ lang, dictionary }: DashboardProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)

        // Simulate API call with realistic delay
        await new Promise((resolve) => setTimeout(resolve, 1200))

        // Mock data with enhanced structure
        setStats({
          totalCourses: 12,
          completedCourses: 3,
          totalLessons: 156,
          completedLessons: 47,
          studyTime: 2340, // minutes
          currentStreak: 7,
          achievements: 15,
          rank: 23,
        })

        // Mock data loading removed as dashboard content is commented out
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [lang])

  // Helper functions removed as dashboard content is commented out

  if (isLoading) {
    return (
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="space-y-6">
          {/* Loading skeleton */}
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
            <div className="h-5 bg-muted rounded w-1/2 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonCard />
            </div>
            <SkeletonCard />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!stats) {
    return (
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Failed to load dashboard data</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <ErrorBoundary>
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="py-12">
          <div className="space-y-3 ml-2 md:ml-4">
            <div className="text-sm text-muted-foreground">
              {(() => {
                const byName = user?.name?.trim().split(" ")[0]
                const byEmail = user?.email ? user.email.split("@")[0] : ""
                const firstName = byName || (byEmail ? byEmail.charAt(0).toUpperCase() + byEmail.slice(1) : "")
                return `As-salamu alaykum wa rahmatullahi wa barakatuh${firstName ? ", " + firstName : ""}`
              })()}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back to your Arabic learning journey!</h1>
          </div>
          <WipNoticeCard />
        </div>
        {/*
          SECTION GROUP: Progress & Stats, Learning/Study Tools, Community
          Temporarily disabled. To restore, uncomment this block.

          <div className="space-y-8">
            ... (previous dashboard content: welcome stats, progress cards, recent activity, quick actions, upcoming lessons, achievements)
          </div>
        */}
      </AppLayout>
    </ErrorBoundary>
  )
}
