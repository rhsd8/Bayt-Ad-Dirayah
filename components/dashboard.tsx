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
        <div className="space-y-8">
          {/* Welcome Section with enhanced design */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border border-primary/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">{getGreeting()}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("dashboard.welcome_message", `Welcome back, ${user?.name || "Student"}!`)}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("dashboard.subtitle", "Continue your Arabic learning journey")}
              </p>

              {/* Quick stats in welcome section */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold">{stats.currentStreak} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">Rank #{stats.rank}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">{formatTime(stats.studyTime)} studied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <p className="text-xs text-muted-foreground mb-3">
                  {stats.completedLessons} of {stats.totalLessons} lessons
                </p>
                <Progress value={overallProgress} className="h-2" />
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTime(stats.studyTime)}</div>
                <p className="text-xs text-muted-foreground">Total time invested</p>
                <div className="mt-2 text-xs text-green-600 font-medium">+2h this week</div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Flame className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <p className="text-xs text-muted-foreground">Days in a row</p>
                <div className="mt-2 text-xs text-orange-600 font-medium">Keep it up! 🔥</div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Trophy className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{stats.rank}</div>
                <p className="text-xs text-muted-foreground">Among all learners</p>
                <div className="mt-2 text-xs text-purple-600 font-medium">↑ 3 positions</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Your latest learning activities</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-transparent hover:from-muted/50 transition-all duration-200 group cursor-pointer"
                        >
                          <div
                            className={`p-2 rounded-lg bg-background shadow-sm group-hover:shadow-md transition-shadow ${
                              index === 0 ? "ring-2 ring-primary/20" : ""
                            }`}
                          >
                            <Icon className={`h-4 w-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium truncate group-hover:text-foreground transition-colors">
                                {activity.title}
                              </h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                            {activity.progress !== undefined && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span className="font-medium">{activity.progress}%</span>
                                </div>
                                <Progress value={activity.progress} className="h-1.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Jump back into learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Button
                        key={action.id}
                        variant="outline"
                        className="w-full justify-start gap-3 h-auto p-4 bg-gradient-to-r from-background to-muted/20 hover:from-muted/30 hover:to-muted/40 transition-all duration-200 group"
                        size="sm"
                      >
                        <div className="p-1.5 rounded-md bg-background shadow-sm group-hover:shadow-md transition-shadow">
                          <Icon className={`h-4 w-4 ${action.color}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                        {action.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {action.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Upcoming Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Lessons
                  </CardTitle>
                  <CardDescription>Your scheduled learning sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingLessons.slice(0, 3).map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer group ${
                          index === 0 ? "bg-primary/5 border-primary/20" : "hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm group-hover:text-foreground transition-colors">
                            {lesson.title}
                          </h4>
                          <Badge className={getDifficultyColor(lesson.difficulty)} variant="secondary">
                            {lesson.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{lesson.course}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.duration} min
                            </span>
                            <span>{new Date(lesson.scheduledFor).toLocaleDateString()}</span>
                          </div>
                          {lesson.progress !== undefined && lesson.progress > 0 && (
                            <span className="text-primary font-medium">{lesson.progress}%</span>
                          )}
                        </div>
                        {lesson.progress !== undefined && lesson.progress > 0 && (
                          <Progress value={lesson.progress} className="h-1 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Recent Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                  <CardDescription>Your latest accomplishments and milestones</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon
                  return (
                    <div
                      key={achievement.id}
                      className="relative p-6 rounded-xl border bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden"
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform"></div>

                      <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-2 group-hover:text-foreground transition-colors">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Unlocked {formatTimeAgo(achievement.unlockedAt)}
                          </p>
                          <div className="flex items-center gap-1 text-xs font-medium text-primary">
                            <Star className="h-3 w-3" />
                            {achievement.points} pts
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ErrorBoundary>
  )
}
