"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Search, Clock, Users, FileText, Play, CheckCircle } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  lessons: number
  materials: number
  duration: string
  students: number
  progress: number
  status: "not_started" | "in_progress" | "completed"
  image: string
}

interface CoursesPageProps {
  lang: string
  dictionary: any
}

export function CoursesPage({ lang, dictionary }: CoursesPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock courses data
  const courses: Course[] = [
    {
      id: "1",
      title: "Arabic Alphabet & Pronunciation",
      description: "Learn the fundamentals of Arabic letters, sounds, and basic pronunciation rules.",
      level: "beginner",
      lessons: 15,
      materials: 8,
      duration: "4 weeks",
      students: 245,
      progress: 85,
      status: "in_progress",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "Basic Grammar & Sentence Structure",
      description: "Master essential Arabic grammar rules and learn to construct simple sentences.",
      level: "beginner",
      lessons: 20,
      materials: 12,
      duration: "6 weeks",
      students: 189,
      progress: 100,
      status: "completed",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      title: "Intermediate Vocabulary Building",
      description: "Expand your Arabic vocabulary with commonly used words and phrases.",
      level: "intermediate",
      lessons: 25,
      materials: 15,
      duration: "8 weeks",
      students: 156,
      progress: 40,
      status: "in_progress",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "4",
      title: "Advanced Reading Comprehension",
      description: "Develop advanced reading skills with authentic Arabic texts and literature.",
      level: "advanced",
      lessons: 30,
      materials: 20,
      duration: "10 weeks",
      students: 89,
      progress: 0,
      status: "not_started",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "5",
      title: "Arabic Calligraphy Basics",
      description: "Learn the beautiful art of Arabic calligraphy and improve your handwriting.",
      level: "intermediate",
      lessons: 18,
      materials: 10,
      duration: "5 weeks",
      students: 134,
      progress: 0,
      status: "not_started",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "6",
      title: "Conversational Arabic",
      description: "Practice speaking Arabic through real-world conversations and dialogues.",
      level: "intermediate",
      lessons: 22,
      materials: 14,
      duration: "7 weeks",
      students: 201,
      progress: 60,
      status: "in_progress",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Play className="h-4 w-4 text-blue-600" />
      default:
        return <BookOpen className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return dictionary.courses.completed
      case "in_progress":
        return dictionary.courses.inProgress
      default:
        return dictionary.courses.notStarted
    }
  }

  const getButtonText = (status: string) => {
    switch (status) {
      case "completed":
        return dictionary.courses.viewCourse
      case "in_progress":
        return dictionary.courses.continueCourse
      default:
        return dictionary.courses.startCourse
    }
  }

  return (
    <AppLayout lang={lang} dictionary={dictionary}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{dictionary.courses.title}</h1>
            <p className="text-muted-foreground text-lg mt-2">{dictionary.courses.description}</p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={dictionary.common.search + " courses..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? dictionary.common.noResults : dictionary.courses.noCourses}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "New courses will be added soon"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight line-clamp-2">{course.title}</CardTitle>
                    <Badge className={getLevelColor(course.level)}>{dictionary.courses[course.level]}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {course.lessons} {dictionary.courses.lessons}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {course.materials} {dictionary.courses.materials}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.students} students</span>
                    </div>
                  </div>

                  {/* Progress for students */}
                  {user?.role === "student" && course.status !== "not_started" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {getStatusIcon(course.status)}
                          {getStatusText(course.status)}
                        </span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => router.push(`/${lang}/courses/${course.id}`)}
                    className="w-full"
                    variant={course.status === "completed" ? "outline" : "default"}
                  >
                    {getButtonText(course.status)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
