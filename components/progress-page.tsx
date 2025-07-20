"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppLayout } from "@/components/app-layout"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import {
  TrendingUp,
  Calendar,
  Trophy,
  Clock,
  Target,
  Award,
  BookOpen,
  Star,
  Flame,
  Users,
  BarChart3,
  Activity,
} from "lucide-react"

interface ProgressPageProps {
  lang: string
  dictionary: any
}

interface CourseProgress {
  id: string
  title: string
  progress: number
  totalLessons: number
  completedLessons: number
  timeSpent: string
  lastAccessed: string
  level: string
  status: "completed" | "in_progress" | "not_started"
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

export function ProgressPage({ lang, dictionary }: ProgressPageProps) {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [totalStudyTime, setTotalStudyTime] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setCourseProgress([
          {
            id: "1",
            title: "Arabic Alphabet & Pronunciation",
            progress: 85,
            totalLessons: 20,
            completedLessons: 17,
            timeSpent: "12h 30m",
            lastAccessed: "2024-01-16T10:30:00Z",
            level: "Beginner",
            status: "in_progress",
          },
          {
            id: "2",
            title: "Basic Grammar Fundamentals",
            progress: 45,
            totalLessons: 15,
            completedLessons: 7,
            timeSpent: "8h 15m",
            lastAccessed: "2024-01-15T16:45:00Z",
            level: "Beginner",
            status: "in_progress",
          },
          {
            id: "3",
            title: "Conversational Arabic",
            progress: 100,
            totalLessons: 12,
            completedLessons: 12,
            timeSpent: "15h 20m",
            lastAccessed: "2024-01-14T14:20:00Z",
            level: "Beginner",
            status: "completed",
          },
        ])

        setAchievements([
          {
            id: "1",
            title: "First Steps",
            description: "Complete your first lesson",
            icon: "🎯",
            earned: true,
            earnedDate: "2024-01-10T09:00:00Z",
          },
          {
            id: "2",
            title: "Week Warrior",
            description: "Maintain a 7-day study streak",
            icon: "🔥",
            earned: true,
            earnedDate: "2024-01-16T08:00:00Z",
          },
          {
            id: "3",
            title: "Grammar Master",
            description: "Complete all grammar lessons",
            icon: "📚",
            earned: false,
          },
          {
            id: "4",
            title: "Perfect Score",
            description: "Get 100% on any quiz",
            icon: "🏆",
            earned: false,
          },
        ])

        setOverallProgress(67)
        setTotalStudyTime(36) // hours
        setCurrentStreak(7)
      } catch (error) {
        console.error("Failed to load progress data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgressData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "not_started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Trophy className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "not_started":
        return <Target className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <AppLayout lang={lang} dictionary={dictionary} title={dictionary?.progress?.title || "Progress"}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout lang={lang} dictionary={dictionary} title={dictionary?.progress?.title || "Progress"}>
      <div className="space-y-6">
        {/* Overall Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudyTime}h</div>
              <p className="text-xs text-muted-foreground">Total time spent learning</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStreak} days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress and Achievements */}
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Course Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4">
              {courseProgress.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>
                          {course.completedLessons} of {course.totalLessons} lessons completed
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(course.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(course.status)}
                          {course.status.replace("_", " ")}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Time spent: {course.timeSpent}</span>
                        <span>Level: {course.level}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.earned ? "" : "opacity-60"}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-base">{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {achievement.earned && achievement.earnedDate && (
                      <p className="text-xs text-muted-foreground">
                        Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
