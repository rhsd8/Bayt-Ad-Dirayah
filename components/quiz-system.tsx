"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Dictionary } from "@/lib/dictionary"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { AppLayout } from "@/components/app-layout"
import {
  Brain,
  Clock,
  Trophy,
  Play,
  Plus,
  Search,
  Star,
  Users,
  CheckCircle,
  XCircle,
  Target,
  BookOpen,
  Filter,
  SortAsc,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

// Types
interface Quiz {
  id: string
  title: string
  description: string
  course: string
  courseId: string
  difficulty: "easy" | "medium" | "hard"
  questions: number
  timeLimit: number
  attempts: number
  maxAttempts: number
  bestScore: number
  averageScore: number
  totalAttempts: number
  createdAt: string
  category: string
  tags: string[]
  isPublic: boolean
  createdBy: string
  status: "active" | "draft" | "archived"
}

interface QuizResult {
  id: string
  quizId: string
  score: number
  totalQuestions: number
  timeSpent: number
  completedAt: string
  answers: QuizAnswer[]
  percentage: number
}

interface QuizAnswer {
  questionId: string
  userAnswer: string | string[]
  correctAnswer: string | string[]
  isCorrect: boolean
  timeSpent: number
}

interface QuizStats {
  totalQuizzes: number
  completedQuizzes: number
  averageScore: number
  totalTimeSpent: number
  streakDays: number
  rank: number
}

interface QuizSystemProps {
  lang: string
  dictionary: Dictionary
}

// Custom hooks
const useQuizData = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockQuizzes: Quiz[] = [
          {
            id: "1",
            title: "Arabic Alphabet Mastery",
            description: "Test your knowledge of Arabic letters and their forms in different positions",
            course: "Arabic Alphabet & Pronunciation",
            courseId: "1",
            difficulty: "easy",
            questions: 20,
            timeLimit: 15,
            attempts: 3,
            maxAttempts: 5,
            bestScore: 85,
            averageScore: 78,
            totalAttempts: 156,
            createdAt: "2024-01-15T10:00:00Z",
            category: "alphabet",
            tags: ["letters", "forms", "beginner", "pronunciation"],
            isPublic: true,
            createdBy: "Dr. Ahmed Hassan",
            status: "active",
          },
          {
            id: "2",
            title: "Basic Grammar Fundamentals",
            description: "Essential Arabic grammar rules including verb conjugation and sentence structure",
            course: "Basic Grammar & Sentence Structure",
            courseId: "2",
            difficulty: "medium",
            questions: 25,
            timeLimit: 20,
            attempts: 2,
            maxAttempts: 3,
            bestScore: 92,
            averageScore: 82,
            totalAttempts: 89,
            createdAt: "2024-01-14T14:30:00Z",
            category: "grammar",
            tags: ["grammar", "verbs", "structure", "intermediate"],
            isPublic: true,
            createdBy: "Dr. Fatima Al-Zahra",
            status: "active",
          },
          {
            id: "3",
            title: "Advanced Vocabulary Challenge",
            description: "Comprehensive test of Arabic vocabulary including synonyms, antonyms, and contextual usage",
            course: "Intermediate Vocabulary Building",
            courseId: "3",
            difficulty: "hard",
            questions: 30,
            timeLimit: 25,
            attempts: 1,
            maxAttempts: 2,
            bestScore: 0,
            averageScore: 75,
            totalAttempts: 45,
            createdAt: "2024-01-12T09:15:00Z",
            category: "vocabulary",
            tags: ["words", "meanings", "advanced", "context"],
            isPublic: true,
            createdBy: "Prof. Omar Khalil",
            status: "active",
          },
          {
            id: "4",
            title: "Pronunciation Practice Quiz",
            description: "Test your understanding of Arabic pronunciation rules and phonetics",
            course: "Arabic Pronunciation Mastery",
            courseId: "4",
            difficulty: "medium",
            questions: 18,
            timeLimit: 12,
            attempts: 0,
            maxAttempts: 4,
            bestScore: 0,
            averageScore: 88,
            totalAttempts: 67,
            createdAt: "2024-01-10T16:45:00Z",
            category: "pronunciation",
            tags: ["pronunciation", "phonetics", "sounds"],
            isPublic: true,
            createdBy: "Dr. Layla Mahmoud",
            status: "active",
          },
        ]

        const mockResults: QuizResult[] = [
          {
            id: "1",
            quizId: "1",
            score: 17,
            totalQuestions: 20,
            timeSpent: 12,
            completedAt: "2024-01-16T10:30:00Z",
            answers: [],
            percentage: 85,
          },
          {
            id: "2",
            quizId: "2",
            score: 23,
            totalQuestions: 25,
            timeSpent: 18,
            completedAt: "2024-01-15T14:20:00Z",
            answers: [],
            percentage: 92,
          },
        ]

        setQuizzes(mockQuizzes)
        setResults(mockResults)
      } catch {
        setError("Failed to load quiz data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { quizzes, results, loading, error, setQuizzes, setResults }
}

const useQuizFilters = (quizzes: Quiz[]) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"title" | "difficulty" | "created" | "popularity">("created")

  const filteredAndSortedQuizzes = useMemo(() => {
    const filtered = quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty
      const matchesCategory = selectedCategory === "all" || quiz.category === selectedCategory

      return matchesSearch && matchesDifficulty && matchesCategory && quiz.status === "active"
    })

    // Sort quizzes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case "popularity":
          return b.totalAttempts - a.totalAttempts
        case "created":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [quizzes, searchQuery, selectedDifficulty, selectedCategory, sortBy])

  return {
    filteredAndSortedQuizzes,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  }
}

// Utility functions
const getDifficultyColor = (difficulty: string): string => {
  const colors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }
  return colors[difficulty as keyof typeof colors] || colors.easy
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return "text-green-600 dark:text-green-400"
  if (score >= 70) return "text-yellow-600 dark:text-yellow-400"
  return "text-red-600 dark:text-red-400"
}

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  const days = Math.floor(diffInHours / 24)
  if (days < 7) return `${days}d ago`
  return time.toLocaleDateString()
}

const calculateStats = (results: QuizResult[]): QuizStats => {
  const totalQuizzes = results.length
  const completedQuizzes = results.length
  const averageScore =
    totalQuizzes > 0 ? Math.round(results.reduce((acc, result) => acc + result.percentage, 0) / totalQuizzes) : 0
  const totalTimeSpent = results.reduce((acc, result) => acc + result.timeSpent, 0)

  return {
    totalQuizzes,
    completedQuizzes,
    averageScore,
    totalTimeSpent,
    streakDays: 5, // Mock data
    rank: 12, // Mock data
  }
}

// Components
const QuizCard = ({
  quiz,
  onStartQuiz,
}: {
  quiz: Quiz
  onStartQuiz: (quizId: string) => void
  dictionary: Dictionary
}) => {
  const canTakeQuiz = quiz.attempts < quiz.maxAttempts
  const progressPercentage = (quiz.attempts / quiz.maxAttempts) * 100

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-foreground transition-colors">
              {quiz.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getDifficultyColor(quiz.difficulty)}>
                {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
              </Badge>
              <Badge variant="secondary">{quiz.category}</Badge>
              {quiz.bestScore > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Trophy className="h-3 w-3" />
                  {quiz.bestScore}%
                </Badge>
              )}
            </div>
          </div>
          {quiz.bestScore > 0 && (
            <div className="text-right ml-4">
              <div className={`text-xl font-bold ${getScoreColor(quiz.bestScore)}`}>{quiz.bestScore}%</div>
              <div className="text-xs text-muted-foreground">Best</div>
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-sm">{quiz.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{quiz.questions} questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{quiz.timeLimit} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{quiz.totalAttempts} attempts</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{quiz.averageScore}% avg</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Attempts: {quiz.attempts}/{quiz.maxAttempts}
            </span>
            <span className="text-muted-foreground">{quiz.course}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex flex-wrap gap-1">
          {quiz.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {quiz.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{quiz.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            By {quiz.createdBy} • {formatTimeAgo(quiz.createdAt)}
          </div>
          <Button onClick={() => onStartQuiz(quiz.id)} disabled={!canTakeQuiz} size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            {!canTakeQuiz ? "Max attempts reached" : "Start Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const QuizStats = ({ stats }: { stats: QuizStats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-2xl font-bold">{stats.completedQuizzes}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-600" />
          <div>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          <div>
            <div className="text-2xl font-bold">{Math.round(stats.totalTimeSpent / 60)}h</div>
            <div className="text-sm text-muted-foreground">Study Time</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-green-600" />
          <div>
            <div className="text-2xl font-bold">#{stats.rank}</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

const QuizFilters = ({
  searchQuery,
  setSearchQuery,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedDifficulty: string
  setSelectedDifficulty: (difficulty: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  categories: string[]
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes, courses, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Newest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="popularity">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
)

const CreateQuizDialog = ({
  open,
  onOpenChange,
  onCreateQuiz,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateQuiz: (quiz: Partial<Quiz>) => void
  dictionary: Dictionary
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    difficulty: "easy",
    questions: "20",
    timeLimit: "15",
    category: "vocabulary",
    tags: "",
  })

  const handleSubmit = useCallback(() => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return
    }

    const newQuiz: Partial<Quiz> = {
      title: formData.title,
      description: formData.description,
      course: formData.course || "General",
      difficulty: formData.difficulty as Quiz["difficulty"],
      questions: Number.parseInt(formData.questions) || 20,
      timeLimit: Number.parseInt(formData.timeLimit) || 15,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      status: "active",
    }

    onCreateQuiz(newQuiz)
    setFormData({
      title: "",
      description: "",
      course: "",
      difficulty: "easy",
      questions: "20",
      timeLimit: "15",
      category: "vocabulary",
      tags: "",
    })
    onOpenChange(false)
  }, [formData, onCreateQuiz, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogDescription>Design a comprehensive quiz to test student knowledge</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="quiz-title">Quiz Title *</Label>
              <Input
                id="quiz-title"
                placeholder="Enter a descriptive title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="quiz-description">Description *</Label>
              <Textarea
                id="quiz-description"
                placeholder="Describe what this quiz covers and its learning objectives"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiz-course">Course</Label>
              <Input
                id="quiz-course"
                placeholder="Associated course name"
                value={formData.course}
                onChange={(e) => setFormData((prev) => ({ ...prev, course: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="quiz-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="pronunciation">Pronunciation</SelectItem>
                  <SelectItem value="alphabet">Alphabet</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quiz-difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quiz-questions">Questions</Label>
              <Input
                id="quiz-questions"
                type="number"
                min="5"
                max="50"
                value={formData.questions}
                onChange={(e) => setFormData((prev) => ({ ...prev, questions: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="quiz-time">Time Limit (min)</Label>
              <Input
                id="quiz-time"
                type="number"
                min="5"
                max="120"
                value={formData.timeLimit}
                onChange={(e) => setFormData((prev) => ({ ...prev, timeLimit: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quiz-tags">Tags (comma separated)</Label>
            <Input
              id="quiz-tags"
              placeholder="beginner, vocabulary, practice, assessment"
              value={formData.tags}
              onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title.trim() || !formData.description.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main component
export function QuizSystem({ lang, dictionary }: QuizSystemProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("available")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const { quizzes, results, loading, error, setQuizzes } = useQuizData()
  const stats = useMemo(() => calculateStats(results), [results])

  const categories = useMemo(() => Array.from(new Set(quizzes.map((quiz) => quiz.category))).sort(), [quizzes])

  const {
    filteredAndSortedQuizzes,
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useQuizFilters(quizzes)

  const handleStartQuiz = useCallback(
    (quizId: string) => {
      router.push(`/${lang}/quiz/${quizId}`)
    },
    [router, lang],
  )

  const handleCreateQuiz = useCallback(
    (newQuizData: Partial<Quiz>) => {
      const quiz: Quiz = {
        id: Date.now().toString(),
        title: newQuizData.title || "",
        description: newQuizData.description || "",
        course: newQuizData.course || "General",
        courseId: "general",
        difficulty: newQuizData.difficulty || "easy",
        questions: newQuizData.questions || 20,
        timeLimit: newQuizData.timeLimit || 15,
        attempts: 0,
        maxAttempts: 3,
        bestScore: 0,
        averageScore: 0,
        totalAttempts: 0,
        createdAt: newQuizData.createdAt || new Date().toISOString(),
        category: newQuizData.category || "vocabulary",
        tags: newQuizData.tags || [],
        isPublic: true,
        createdBy: user?.name || "Unknown",
        status: "active",
      }

      setQuizzes((prev) => [quiz, ...prev])
      toast({
        title: "Quiz Created Successfully",
        description: `"${quiz.title}" has been added to the quiz library`,
      })
    },
    [user, setQuizzes, toast],
  )

  if (loading) {
    return (
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading quiz data...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Quizzes</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout lang={lang} dictionary={dictionary}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Brain className="h-8 w-8 text-primary" />
                Quiz Center
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Test your knowledge and track your progress with interactive quizzes
              </p>
            </div>

            {user?.role === "admin" && (
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Quiz
              </Button>
            )}
          </div>

          <QuizStats stats={stats} />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Available Quizzes
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              My Results
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <QuizFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={(sort) => setSortBy(sort as typeof sortBy)}
              categories={categories}
            />

            {filteredAndSortedQuizzes.length === 0 ? (
              <Card className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Quizzes Found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDifficulty("all")
                    setSelectedCategory("all")
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedQuizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} onStartQuiz={handleStartQuiz} dictionary={dictionary} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="space-y-4">
              {results.length === 0 ? (
                <Card className="p-12 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Quiz Results Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Take your first quiz to see your results and track your progress
                  </p>
                  <Button onClick={() => setActiveTab("available")}>Browse Quizzes</Button>
                </Card>
              ) : (
                results.map((result) => {
                  const quiz = quizzes.find((q) => q.id === result.quizId)
                  if (!quiz) return null

                  return (
                    <Card key={result.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2 flex-1">
                            <h3 className="text-lg font-semibold">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground">{quiz.course}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{result.score} correct</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span>{result.totalQuestions - result.score} incorrect</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{result.timeSpent} minutes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{formatTimeAgo(result.completedAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-3xl font-bold ${getScoreColor(result.percentage)}`}>
                              {result.percentage}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {result.score}/{result.totalQuestions}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Progress value={result.percentage} className="h-3" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Global Leaderboard
                </CardTitle>
                <CardDescription>Top performers across all quizzes this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "Ahmed Al-Rashid", score: 95, quizzes: 12, badge: "🥇", streak: 15 },
                    { rank: 2, name: "Sarah Johnson", score: 92, quizzes: 10, badge: "🥈", streak: 8 },
                    { rank: 3, name: "Omar Hassan", score: 89, quizzes: 15, badge: "🥉", streak: 12 },
                    { rank: 4, name: "Fatima Al-Zahra", score: 87, quizzes: 8, badge: "", streak: 6 },
                    {
                      rank: 5,
                      name: "You",
                      score: stats.averageScore,
                      quizzes: results.length,
                      badge: "",
                      streak: stats.streakDays,
                      isCurrentUser: true,
                    },
                    { rank: 6, name: "Maria Rodriguez", score: 84, quizzes: 9, badge: "", streak: 4 },
                    { rank: 7, name: "Chen Wei", score: 82, quizzes: 11, badge: "", streak: 7 },
                  ].map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        entry.isCurrentUser
                          ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-muted-foreground w-8 text-center">
                          {entry.badge || `#${entry.rank}`}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">{entry.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className={`font-semibold ${entry.isCurrentUser ? "text-primary" : ""}`}>
                              {entry.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {entry.quizzes} quizzes • {entry.streak} day streak
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getScoreColor(entry.score)}`}>{entry.score}%</div>
                        <div className="text-sm text-muted-foreground">Average</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <CreateQuizDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreateQuiz={handleCreateQuiz}
          dictionary={dictionary}
        />
      </div>
    </AppLayout>
  )
}
