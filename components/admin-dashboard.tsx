"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useAdminAuth, withAdminAuth } from "@/components/admin-auth-provider"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  BarChart3,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  X,
  Search,
} from "lucide-react"

interface AdminDashboardProps {
  lang: string
  dictionary: any
}

interface Course {
  id: string
  title: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  students: number
  materials: number
  status: "active" | "draft" | "archived"
  createdAt: string
  lastUpdated: string
  instructor: string
  rating: number
  completionRate: number
}

interface Material {
  id: string
  title: string
  course: string
  courseId: string
  size: string
  uploadDate: string
  downloads: number
  type: "pdf" | "video" | "audio"
  status: "active" | "processing" | "error"
  author: string
  tags: string[]
}

interface UploadProgress {
  fileName: string
  progress: number
  status: "uploading" | "processing" | "complete" | "error"
}

export function AdminDashboard({ lang, dictionary }: AdminDashboardProps) {
  const { user } = useAuth()
  const { admin, logout } = useAdminAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [showUploadMaterial, setShowUploadMaterial] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  
  // Temporary bypass: set NEXT_PUBLIC_ADMIN_BYPASS=true in .env.local to view admin without auth
  const bypass = typeof process !== "undefined" && process.env.NEXT_PUBLIC_ADMIN_BYPASS === "true"

  // Enhanced mock data
  const stats = [
    {
      title: dictionary.admin.totalStudents,
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      description: "Active learners this month",
    },
    {
      title: dictionary.admin.totalCourses,
      value: "24",
      change: "+3",
      trend: "up",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      description: "Published courses",
    },
    {
      title: dictionary.admin.totalMaterials,
      value: "156",
      change: "+18",
      trend: "up",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      description: "Learning resources",
    },
    {
      title: "Completion Rate",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      description: "Average course completion",
    },
  ]

  const courses: Course[] = [
    {
      id: "1",
      title: "Arabic Alphabet & Pronunciation",
      description: "Learn the fundamentals of Arabic letters and sounds",
      level: "beginner",
      students: 245,
      materials: 8,
      status: "active",
      createdAt: "2024-01-01",
      lastUpdated: "2024-01-15",
      instructor: "Dr. Ahmed Hassan",
      rating: 4.8,
      completionRate: 85,
    },
    {
      id: "2",
      title: "Basic Grammar & Sentence Structure",
      description: "Master essential Arabic grammar rules",
      level: "beginner",
      students: 189,
      materials: 12,
      status: "active",
      createdAt: "2024-01-05",
      lastUpdated: "2024-01-14",
      instructor: "Dr. Fatima Al-Zahra",
      rating: 4.6,
      completionRate: 78,
    },
    {
      id: "3",
      title: "Advanced Arabic Literature",
      description: "Explore classical and modern Arabic literature",
      level: "advanced",
      students: 67,
      materials: 25,
      status: "draft",
      createdAt: "2024-01-10",
      lastUpdated: "2024-01-16",
      instructor: "Prof. Omar Khalil",
      rating: 0,
      completionRate: 0,
    },
  ]

  const materials: Material[] = [
    {
      id: "1",
      title: "Arabic Alphabet Guide.pdf",
      course: "Arabic Alphabet & Pronunciation",
      courseId: "1",
      size: "3.2 MB",
      uploadDate: "2024-01-15",
      downloads: 245,
      type: "pdf",
      status: "active",
      author: "Dr. Ahmed Hassan",
      tags: ["alphabet", "beginner", "pronunciation"],
    },
    {
      id: "2",
      title: "Grammar Rules Comprehensive.pdf",
      course: "Basic Grammar & Sentence Structure",
      courseId: "2",
      size: "2.7 MB",
      uploadDate: "2024-01-14",
      downloads: 189,
      type: "pdf",
      status: "active",
      author: "Dr. Fatima Al-Zahra",
      tags: ["grammar", "rules", "structure"],
    },
    {
      id: "3",
      title: "Pronunciation Audio Guide.mp3",
      course: "Arabic Alphabet & Pronunciation",
      courseId: "1",
      size: "15.8 MB",
      uploadDate: "2024-01-13",
      downloads: 156,
      type: "audio",
      status: "processing",
      author: "Dr. Ahmed Hassan",
      tags: ["audio", "pronunciation", "practice"],
    },
  ]

  const recentActivity = [
    { action: "New student enrolled", course: "Arabic Alphabet", user: "Sarah Johnson", time: "2 hours ago" },
    { action: "Material uploaded", course: "Grammar Basics", user: "Dr. Ahmed Hassan", time: "4 hours ago" },
    { action: "Course completed", course: "Vocabulary Building", user: "Mike Chen", time: "6 hours ago" },
    { action: "New course created", course: "Advanced Reading", user: "Prof. Omar Khalil", time: "1 day ago" },
    { action: "Material downloaded", course: "Pronunciation Guide", user: "Emma Wilson", time: "2 days ago" },
  ]

  const handleCreateCourse = () => {
    toast({
      title: "Success",
      description: "Course created successfully!",
    })
    setShowCreateCourse(false)
  }

  const handleUploadMaterial = () => {
    const fileName = "example-material.pdf"
    const newUpload: UploadProgress = {
      fileName,
      progress: 0,
      status: "uploading",
    }

    setUploadProgress((prev) => [...prev, newUpload])

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) =>
        prev.map((upload) =>
          upload.fileName === fileName ? { ...upload, progress: Math.min(upload.progress + 10, 100) } : upload,
        ),
      )
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress((prev) =>
        prev.map((upload) =>
          upload.fileName === fileName ? { ...upload, status: "complete", progress: 100 } : upload,
        ),
      )
      toast({
        title: "Success",
        description: dictionary.materials.uploadSuccess,
      })
    }, 2000)

    setShowUploadMaterial(false)
  }

  const handleBulkUpload = () => {
    // Simulate bulk upload
    const files = ["file1.pdf", "file2.pdf", "file3.mp3"]
    const uploads: UploadProgress[] = files.map((file) => ({
      fileName: file,
      progress: 0,
      status: "uploading" as const,
    }))

    setUploadProgress((prev) => [...prev, ...uploads])

    files.forEach((fileName, index) => {
      setTimeout(() => {
        const interval = setInterval(() => {
          setUploadProgress((prev) =>
            prev.map((upload) =>
              upload.fileName === fileName ? { ...upload, progress: Math.min(upload.progress + 15, 100) } : upload,
            ),
          )
        }, 150)

        setTimeout(() => {
          clearInterval(interval)
          setUploadProgress((prev) =>
            prev.map((upload) =>
              upload.fileName === fileName ? { ...upload, status: "complete", progress: 100 } : upload,
            ),
          )
        }, 1000)
      }, index * 500)
    })

    toast({
      title: "Bulk Upload Started",
      description: `Uploading ${files.length} files...`,
    })
    setShowBulkUpload(false)
  }

  const handleDeleteCourse = (courseId: string) => {
    toast({
      title: "Course Deleted",
      description: "Course has been permanently deleted.",
    })
  }

  const handleDeleteMaterial = (materialId: string) => {
    toast({
      title: "Material Deleted",
      description: "Material has been removed successfully.",
    })
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || course.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || material.status === filterStatus
    return matchesSearch && matchesFilter
  })

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  if (!bypass && !admin) {
    return (
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to access this page.</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout lang={lang} dictionary={dictionary}>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{dictionary.admin.title}</h1>
            <p className="text-muted-foreground text-lg">Comprehensive platform management and analytics</p>
            {admin && <p className="text-sm text-muted-foreground">Welcome, {admin.name}</p>}
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {uploadProgress.map((upload, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{upload.fileName}</span>
                    <div className="flex items-center gap-2">
                      {upload.status === "complete" && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {upload.status === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
                      <span className="text-sm text-muted-foreground">{upload.progress}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadProgress((prev) => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={upload.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enhanced Quick Actions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Dialog open={showCreateCourse} onOpenChange={setShowCreateCourse}>
                      <DialogTrigger asChild>
                        <Button className="h-20 flex-col gap-2">
                          <Plus className="h-6 w-6" />
                          <span>{dictionary.admin.createCourse}</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{dictionary.admin.createCourse}</DialogTitle>
                          <DialogDescription>Create a comprehensive new course for students</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="title">{dictionary.admin.courseTitle}</Label>
                              <Input id="title" placeholder="Enter course title" />
                            </div>
                            <div>
                              <Label htmlFor="instructor">Instructor</Label>
                              <Input id="instructor" placeholder="Instructor name" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="description">{dictionary.admin.courseDescription}</Label>
                            <Textarea id="description" placeholder="Enter detailed course description" rows={3} />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="level">{dictionary.admin.courseLevel}</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="beginner">{dictionary.courses.beginner}</SelectItem>
                                  <SelectItem value="intermediate">{dictionary.courses.intermediate}</SelectItem>
                                  <SelectItem value="advanced">{dictionary.courses.advanced}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="duration">Duration</Label>
                              <Input id="duration" placeholder="e.g., 4 weeks" />
                            </div>
                            <div>
                              <Label htmlFor="price">Price</Label>
                              <Input id="price" placeholder="e.g., $99" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input id="tags" placeholder="arabic, beginner, grammar" />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowCreateCourse(false)}>
                              {dictionary.common.cancel}
                            </Button>
                            <Button onClick={handleCreateCourse}>{dictionary.common.save}</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showUploadMaterial} onOpenChange={setShowUploadMaterial}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                          <Upload className="h-6 w-6" />
                          <span>{dictionary.materials.uploadMaterial}</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{dictionary.materials.uploadMaterial}</DialogTitle>
                          <DialogDescription>Upload learning materials with detailed metadata</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="course">Course</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                  {courses.map((course) => (
                                    <SelectItem key={course.id} value={course.id}>
                                      {course.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="grammar">Grammar</SelectItem>
                                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                                  <SelectItem value="pronunciation">Pronunciation</SelectItem>
                                  <SelectItem value="reading">Reading</SelectItem>
                                  <SelectItem value="writing">Writing</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="title">Material Title</Label>
                            <Input id="title" placeholder="Enter material title" />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Describe the material content" rows={2} />
                          </div>
                          <div>
                            <Label htmlFor="file">File Upload</Label>
                            <Input id="file" type="file" accept=".pdf,.mp3,.mp4,.doc,.docx" multiple />
                            <p className="text-xs text-muted-foreground mt-1">
                              Supported formats: PDF, MP3, MP4, DOC, DOCX (Max 50MB each)
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="tags">Tags</Label>
                            <Input id="tags" placeholder="Enter tags separated by commas" />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowUploadMaterial(false)}>
                              {dictionary.common.cancel}
                            </Button>
                            <Button onClick={handleUploadMaterial}>{dictionary.common.upload}</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                          <FileText className="h-6 w-6" />
                          <span>Bulk Upload</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Bulk Material Upload</DialogTitle>
                          <DialogDescription>Upload multiple materials at once</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="bulk-course">Default Course</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select default course" />
                              </SelectTrigger>
                              <SelectContent>
                                {courses.map((course) => (
                                  <SelectItem key={course.id} value={course.id}>
                                    {course.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="bulk-files">Files</Label>
                            <Input id="bulk-files" type="file" multiple accept=".pdf,.mp3,.mp4" />
                            <p className="text-xs text-muted-foreground mt-1">
                              Select multiple files to upload simultaneously
                            </p>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowBulkUpload(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleBulkUpload}>Start Bulk Upload</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                      <BarChart3 className="h-6 w-6" />
                      <span>View Analytics</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {dictionary.admin.recentActivity}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <div className="space-y-1 min-w-0 flex-1">
                            <p className="text-sm font-medium leading-none">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.course} • {activity.user}
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Manage Courses</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowCreateCourse(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {dictionary.admin.createCourse}
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <Badge className={getLevelColor(course.level)}>{dictionary.courses[course.level]}</Badge>
                          <Badge className={getStatusColor(course.status)}>
                            {getStatusIcon(course.status)}
                            <span className="ml-1 capitalize">{course.status}</span>
                          </Badge>
                        </div>
                        <CardDescription className="max-w-2xl">{course.description}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>By {course.instructor}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                          <span>•</span>
                          <span>Updated {new Date(course.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteCourse(course.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Students:</span>
                        <p className="text-muted-foreground">{course.students}</p>
                      </div>
                      <div>
                        <span className="font-medium">Materials:</span>
                        <p className="text-muted-foreground">{course.materials}</p>
                      </div>
                      <div>
                        <span className="font-medium">Completion:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={course.completionRate} className="h-2 flex-1" />
                          <span className="text-muted-foreground">{course.completionRate}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>
                        <p className="text-muted-foreground">{new Date(course.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Manage Materials</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowUploadMaterial(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  {dictionary.materials.uploadMaterial}
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-8 w-8 text-red-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{material.title}</h3>
                            <Badge className={getStatusColor(material.status)}>
                              {getStatusIcon(material.status)}
                              <span className="ml-1 capitalize">{material.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{material.course}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">By {material.author}</span>
                            <span>•</span>
                            <span className="text-xs text-muted-foreground">{material.size}</span>
                            <span>•</span>
                            <span className="text-xs text-muted-foreground">{material.downloads} downloads</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {material.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteMaterial(material.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Course Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.slice(0, 3).map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="truncate">{course.title}</span>
                          <span>{course.completionRate}%</span>
                        </div>
                        <Progress value={course.completionRate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="font-medium">456</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Weekly Active Users</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Active Users</span>
                      <span className="font-medium">3,456</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Session Time</span>
                      <span className="font-medium">24 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Downloads</span>
                      <span className="font-medium">12,456</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Most Downloaded</span>
                      <span className="font-medium text-xs">Arabic Alphabet Guide</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.7</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage Used</span>
                      <span className="font-medium">2.3 GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {materials.slice(0, 5).map((material, index) => (
                      <div key={material.id} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{material.title}</p>
                          <p className="text-xs text-muted-foreground">{material.downloads} downloads</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {material.type.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Server Performance</span>
                        <span className="text-green-600">Excellent</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Database Health</span>
                        <span className="text-green-600">Good</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Storage Usage</span>
                        <span className="text-yellow-600">Moderate</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CDN Performance</span>
                        <span className="text-green-600">Optimal</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">User Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive user management features including user roles, permissions, and activity monitoring.
                  </p>
                  <Button>Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
