"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, FileText, Clock, Users, Play, CheckCircle, ArrowLeft, Star, Download, Eye } from "lucide-react"

import { Dictionary } from "@/lib/dictionary";

interface CourseDetailPageProps {
  lang: string
  courseId: string
  dictionary: Dictionary
}

interface Material {
  id: string
  title: string
  type: "pdf" | "video" | "quiz"
  size: string
  completed: boolean
  lessonTitle?: string
}

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  materials: Material[]
  completed: boolean
}

export function CourseDetailPage({ lang, courseId, dictionary }: CourseDetailPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [enrolling, setEnrolling] = useState(false)

  // Mock course data
  const course = {
    id: courseId,
    title: "Arabic Alphabet & Pronunciation",
    description:
      "Learn the fundamentals of Arabic letters, sounds, and basic pronunciation rules. This comprehensive course will guide you through each letter of the Arabic alphabet, teaching you proper pronunciation, writing techniques, and common usage patterns.",
    level: "beginner" as const,
    lessons: 15,
    materials: 8,
    duration: "4 weeks",
    students: 245,
    progress: 85,
    status: "in_progress" as const,
    instructor: "Dr. Ahmed Hassan",
    lastUpdated: "2024-01-15",
    rating: 4.8,
    reviews: 156,
    enrolled: true,
  }

  const lessons: Lesson[] = [
    {
      id: "1",
      title: "Introduction to Arabic Script",
      description: "Overview of the Arabic writing system and its characteristics",
      duration: "30 min",
      completed: true,
      materials: [
        { id: "1", title: "Arabic Script Overview.pdf", type: "pdf", size: "2.5 MB", completed: true },
        { id: "2", title: "Writing Practice Sheet.pdf", type: "pdf", size: "1.8 MB", completed: true },
      ],
    },
    {
      id: "2",
      title: "Letters Alif to Taa",
      description: "Learn the first set of Arabic letters with proper pronunciation",
      duration: "45 min",
      completed: true,
      materials: [
        { id: "3", title: "Letters Alif-Taa Guide.pdf", type: "pdf", size: "3.2 MB", completed: true },
        { id: "4", title: "Pronunciation Audio.mp3", type: "video", size: "15 MB", completed: false },
      ],
    },
    {
      id: "3",
      title: "Letters Thaa to Khaa",
      description: "Continue learning Arabic letters with focus on pronunciation",
      duration: "45 min",
      completed: false,
      materials: [
        { id: "5", title: "Letters Thaa-Khaa Guide.pdf", type: "pdf", size: "2.9 MB", completed: false },
        { id: "6", title: "Practice Exercises.pdf", type: "pdf", size: "1.5 MB", completed: false },
      ],
    },
  ]

  const handleEnrollCourse = async () => {
    setEnrolling(true)
    // Simulate enrollment
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Success!",
      description: "You have successfully enrolled in this course.",
    })
    setEnrolling(false)
  }

  const handleStartLesson = (lessonId: string) => {
    toast({
      title: "Lesson Started",
      description: `Opening lesson ${lessonId}...`,
    })
    // In a real app, this would navigate to the lesson
  }

  const handleViewMaterial = (materialId: string) => {
    router.push(`/${lang}/materials/${materialId}`)
  }

  const handleDownloadMaterial = (material: Material) => {
    const link = document.createElement("a")
    link.href = "/placeholder.pdf"
    link.download = material.title
    link.click()

    toast({
      title: "Download Started",
      description: `Downloading ${material.title}...`,
    })
  }

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Play className="h-4 w-4" />
      case "quiz":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <AppLayout lang={lang} dictionary={dictionary}>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push(`/${lang}/courses`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {dictionary.common.back}
        </Button>

        {/* Course Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                <Badge className={getLevelColor(course.level)}>{dictionary.courses[course.level]}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                  <span>({course.reviews} reviews)</span>
                </div>
                <span>•</span>
                <span>By {course.instructor}</span>
              </div>
              <p className="text-muted-foreground text-lg max-w-3xl">{course.description}</p>
            </div>

            {!course.enrolled && (
              <Button size="lg" onClick={handleEnrollCourse} disabled={enrolling} className="shrink-0">
                {enrolling ? "Enrolling..." : dictionary.courses.startCourse}
              </Button>
            )}
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>
                {course.lessons} {dictionary.courses.lessons}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>
                {course.materials} {dictionary.courses.materials}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{course.students} students</span>
            </div>
          </div>

          {/* Progress */}
          {course.enrolled && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                      This comprehensive Arabic alphabet course is designed for complete beginners who want to master
                      the fundamentals of Arabic script and pronunciation. You&apos;ll learn each of the 28 letters of the
                      Arabic alphabet, understand their different forms (isolated, initial, medial, and final), and
                      practice proper pronunciation with native speaker audio.
                    </p>
                    <p>
                      The course includes interactive exercises, downloadable practice sheets, and step-by-step video
                      demonstrations to ensure you develop strong foundational skills in Arabic reading and writing.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What You&apos;ll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        All 28 letters of the Arabic alphabet
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Proper pronunciation of each letter
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Letter forms in different positions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Basic writing techniques
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Reading simple Arabic words
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Cultural context and usage
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        No prior knowledge of Arabic required
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Computer or mobile device with internet
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Headphones recommended for audio lessons
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Dedication to practice 30 minutes daily
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <span className="font-medium">Instructor:</span>
                      <p className="text-muted-foreground">{course.instructor}</p>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p className="text-muted-foreground">{course.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium">Level:</span>
                      <p className="text-muted-foreground capitalize">{course.level}</p>
                    </div>
                    <div>
                      <span className="font-medium">Language:</span>
                      <p className="text-muted-foreground">Arabic/English</p>
                    </div>
                    <div>
                      <span className="font-medium">Certificate:</span>
                      <p className="text-muted-foreground">Yes, upon completion</p>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <p className="text-muted-foreground">{course.lastUpdated}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-sm text-muted-foreground">({course.reviews} reviews)</span>
                    </div>

                    <div className="space-y-3">
                      <div className="border-l-2 border-primary pl-4">
                        <p className="text-sm">
                          &ldquo;Excellent course! The step-by-step approach made learning Arabic alphabet so much easier.&rdquo;
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">- Sarah M., 2 days ago</p>
                      </div>
                      <div className="border-l-2 border-primary pl-4">
                        <p className="text-sm">
                          &ldquo;Great pronunciation guides and practice materials. Highly recommended for beginners.&rdquo;
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">- Ahmed K., 1 week ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Related Courses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium text-sm">Basic Grammar Rules</h4>
                      <p className="text-xs text-muted-foreground">Continue your Arabic journey</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium text-sm">Arabic Vocabulary Building</h4>
                      <p className="text-xs text-muted-foreground">Expand your word knowledge</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Course Curriculum</h3>
              <Badge variant="secondary">{lessons.length} lessons</Badge>
            </div>

            {lessons.map((lesson, index) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          lesson.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : course.enrolled
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {lesson.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        <CardDescription>{lesson.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {lesson.duration}
                      </div>
                      {course.enrolled && (
                        <Button
                          size="sm"
                          variant={lesson.completed ? "outline" : "default"}
                          onClick={() => handleStartLesson(lesson.id)}
                        >
                          {lesson.completed ? "Review" : "Start"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Lesson Materials:</h4>
                    <div className="grid gap-2">
                      {lesson.materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(material.type)}
                            <span className="text-sm">{material.title}</span>
                            <span className="text-xs text-muted-foreground">({material.size})</span>
                            {material.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewMaterial(material.id)}
                              disabled={!course.enrolled}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadMaterial(material)}
                              disabled={!course.enrolled}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!course.enrolled && (
                      <div className="text-center py-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Enroll to access lesson materials</p>
                        <Button size="sm" onClick={handleEnrollCourse} disabled={enrolling}>
                          {enrolling ? "Enrolling..." : "Enroll Now"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">All Course Materials</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{lessons.flatMap((l) => l.materials).length} files</Badge>
                {course.enrolled && (
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-3">
                  {lessons
                    .flatMap((lesson) =>
                      lesson.materials.map((material) => ({ ...material, lessonTitle: lesson.title })),
                    )
                    .map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getTypeIcon(material.type)}
                          <div>
                            <p className="text-sm font-medium">{material.title}</p>
                            <p className="text-xs text-muted-foreground">
                              From: {material.lessonTitle} • {material.size}
                            </p>
                          </div>
                          {material.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewMaterial(material.id)}
                            disabled={!course.enrolled}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {dictionary.materials.viewPDF}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadMaterial(material)}
                            disabled={!course.enrolled}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {dictionary.materials.downloadPDF}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>

                {!course.enrolled && (
                  <div className="text-center py-8 bg-muted/30 rounded-lg mt-4">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Enroll to Access Materials</h3>
                    <p className="text-muted-foreground mb-4">
                      Get access to all course materials including PDFs, audio files, and interactive content.
                    </p>
                    <Button onClick={handleEnrollCourse} disabled={enrolling}>
                      {enrolling ? "Enrolling..." : dictionary.courses.startCourse}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
