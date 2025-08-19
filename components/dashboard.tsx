"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { AppLayout } from "@/components/app-layout"
import { SkeletonCard } from "@/components/loading-spinner"
import { ErrorBoundary } from "@/components/error-boundary"
import { WipNoticeCard } from "@/components/wip-notice"
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Calendar,
  Play,
  Star,
  Flame,
  Award,
  Users,
  Brain,
  Zap,
  ArrowRight,
  ChevronRight,
  Activity,
  Bookmark,
  MessageSquare,
} from "lucide-react"

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

interface RecentActivity {
  id: string
  type: "lesson" | "quiz" | "achievement" | "course" | "note" | "discussion"
  title: string
  description: string
  timestamp: string
  progress?: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface UpcomingLesson {
  id: string
  title: string
  course: string
  duration: number
  difficulty: "easy" | "medium" | "hard"
  scheduledFor: string
  progress?: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  unlockedAt: string
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
  badge?: string
}

interface DashboardProps {
  lang: string
  dictionary: any
}

export function Dashboard({ lang, dictionary }: DashboardProps) {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [upcomingLessons, setUpcomingLessons] = useState<UpcomingLesson[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])

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

        setRecentActivity([
          {
            id: "1",
            type: "lesson",
            title: "Arabic Alphabet - Letter ع",
            description: "Completed pronunciation lesson with 95% accuracy",
            timestamp: "2024-01-16T10:30:00Z",
            progress: 100,
            icon: BookOpen,
            color: "text-blue-600",
          },
          {
            id: "2",
            type: "quiz",
            title: "Grammar Quiz - Present Tense",
            description: "Scored 85% on advanced grammar quiz",
            timestamp: "2024-01-16T09:15:00Z",
            progress: 85,
            icon: Brain,
            color: "text-purple-600",
          },
          {
            id: "3",
            type: "achievement",
            title: "Week Warrior",
            description: "Maintained 7-day study streak",
            timestamp: "2024-01-16T08:00:00Z",
            icon: Flame,
            color: "text-orange-600",
          },
          {
            id: "4",
            type: "note",
            title: "Grammar Notes Updated",
            description: "Added 5 new notes on verb conjugation",
            timestamp: "2024-01-15T18:30:00Z",
            icon: Bookmark,
            color: "text-green-600",
          },
          {
            id: "5",
            type: "discussion",
            title: "Community Discussion",
            description: "Participated in pronunciation help thread",
            timestamp: "2024-01-15T16:45:00Z",
            icon: MessageSquare,
            color: "text-indigo-600",
          },
        ])

        setUpcomingLessons([
          {
            id: "1",
            title: "Arabic Numbers 1-10",
            course: "Basic Vocabulary",
            duration: 25,
            difficulty: "easy",
            scheduledFor: "2024-01-17T14:00:00Z",
            progress: 0,
          },
          {
            id: "2",
            title: "Verb Conjugation Basics",
            course: "Grammar Fundamentals",
            duration: 35,
            difficulty: "medium",
            scheduledFor: "2024-01-17T16:30:00Z",
            progress: 15,
          },
          {
            id: "3",
            title: "Common Phrases",
            course: "Conversational Arabic",
            duration: 20,
            difficulty: "easy",
            scheduledFor: "2024-01-18T10:00:00Z",
            progress: 0,
          },
        ])

        setAchievements([
          {
            id: "1",
            title: "First Steps",
            description: "Complete your first lesson",
            icon: Star,
            unlockedAt: "2024-01-10T12:00:00Z",
            rarity: "common",
            points: 10,
          },
          {
            id: "2",
            title: "Quiz Master",
            description: "Score 90% or higher on 5 quizzes",
            icon: Trophy,
            unlockedAt: "2024-01-14T15:30:00Z",
            rarity: "rare",
            points: 50,
          },
          {
            id: "3",
            title: "Week Warrior",
            description: "Maintain a 7-day study streak",
            icon: Flame,
            unlockedAt: "2024-01-16T08:00:00Z",
            rarity: "epic",
            points: 100,
          },
        ])

        setQuickActions([
          {
            id: "1",
            title: "Continue Learning",
            description: "Resume your current lesson",
            icon: Play,
            href: `/${lang}/courses/current`,
            color: "text-blue-600",
            badge: "In Progress",
          },
          {
            id: "2",
            title: "Take Quiz",
            description: "Test your knowledge",
            icon: Brain,
            href: `/${lang}/quiz`,
            color: "text-purple-600",
            badge: "3 Available",
          },
          {
            id: "3",
            title: "Practice Flashcards",
            description: "Review vocabulary",
            icon: Zap,
            href: `/${lang}/flashcards`,
            color: "text-yellow-600",
            badge: "45 Cards",
          },
          {
            id: "4",
            title: "Join Community",
            description: "Connect with learners",
            icon: Users,
            href: `/${lang}/community`,
            color: "text-green-600",
            badge: "12 New Posts",
          },
        ])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [lang])

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const days = Math.floor(diffInHours / 24)
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return time.toLocaleDateString()
  }

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const overallProgress = useMemo(() => {
    if (!stats) return 0
    return Math.round((stats.completedLessons / stats.totalLessons) * 100)
  }, [stats])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t("dashboard.good_morning", "Good morning")
    if (hour < 17) return t("dashboard.good_afternoon", "Good afternoon")
    return t("dashboard.good_evening", "Good evening")
  }

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
