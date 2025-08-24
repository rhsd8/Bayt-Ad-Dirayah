"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { AppLayout } from "@/components/app-layout"
import {
  Brain,
  Plus,
  Search,
  RotateCcw,
  Check,
  X,
  BookOpen,
  Volume2,
  Edit,
  Trash2,
  Target,
  TrendingUp,
  Clock,
  Filter,
  SortAsc,
  Play,
  AlertCircle,
  Zap,
  Calendar,
  Award,
} from "lucide-react"

// Types
interface Flashcard {
  id: string
  front: string
  back: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  createdAt: string
  lastReviewed?: string
  reviewCount: number
  correctCount: number
  incorrectCount: number
  nextReview: string
  interval: number
  easeFactor: number
  isStarred: boolean
}

interface StudySession {
  id: string
  date: string
  cardsStudied: number
  correctAnswers: number
  timeSpent: number
  sessionType: "review" | "new" | "mixed"
}

interface StudyStats {
  totalCards: number
  dueCards: number
  newCards: number
  masteredCards: number
  averageAccuracy: number
  totalReviews: number
  studyStreak: number
  timeSpent: number
}

interface FlashcardSystemProps {
  lang: string
  dictionary: Record<string, unknown>
}

// Custom hooks
const useFlashcardData = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 800))

        const now = new Date()
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

        const mockFlashcards: Flashcard[] = [
          {
            id: "1",
            front: "مرحبا",
            back: "Hello / Welcome - A common greeting used in formal and informal situations",
            category: "vocabulary",
            difficulty: "easy",
            tags: ["greetings", "basic", "common"],
            createdAt: "2024-01-15T10:00:00Z",
            lastReviewed: yesterday.toISOString(),
            reviewCount: 8,
            correctCount: 6,
            incorrectCount: 2,
            nextReview: now.toISOString(),
            interval: 2,
            easeFactor: 2.5,
            isStarred: true,
          },
          {
            id: "2",
            front: "كتاب",
            back: "Book - A written or printed work consisting of pages",
            category: "vocabulary",
            difficulty: "easy",
            tags: ["objects", "education", "reading"],
            createdAt: "2024-01-14T14:30:00Z",
            lastReviewed: yesterday.toISOString(),
            reviewCount: 5,
            correctCount: 4,
            incorrectCount: 1,
            nextReview: now.toISOString(),
            interval: 3,
            easeFactor: 2.6,
            isStarred: false,
          },
          {
            id: "3",
            front: "الفعل المضارع",
            back: "Present tense verb - Used to describe actions happening now or habitually",
            category: "grammar",
            difficulty: "medium",
            tags: ["verbs", "tenses", "grammar"],
            createdAt: "2024-01-13T09:15:00Z",
            reviewCount: 3,
            correctCount: 2,
            incorrectCount: 1,
            nextReview: tomorrow.toISOString(),
            interval: 4,
            easeFactor: 2.4,
            isStarred: false,
          },
          {
            id: "4",
            front: "أهلا وسهلا",
            back: "Welcome (formal greeting) - A warm, hospitable greeting meaning 'you are among family and on level ground'",
            category: "phrases",
            difficulty: "medium",
            tags: ["greetings", "formal", "hospitality"],
            createdAt: "2024-01-12T16:45:00Z",
            reviewCount: 4,
            correctCount: 4,
            incorrectCount: 0,
            nextReview: nextWeek.toISOString(),
            interval: 7,
            easeFactor: 2.8,
            isStarred: true,
          },
          {
            id: "5",
            front: "بيت",
            back: "House / Home - A building for human habitation",
            category: "vocabulary",
            difficulty: "easy",
            tags: ["places", "family", "basic"],
            createdAt: "2024-01-11T11:20:00Z",
            reviewCount: 0,
            correctCount: 0,
            incorrectCount: 0,
            nextReview: now.toISOString(),
            interval: 1,
            easeFactor: 2.5,
            isStarred: false,
          },
        ]

        const mockSessions: StudySession[] = [
          {
            id: "1",
            date: "2024-01-16",
            cardsStudied: 15,
            correctAnswers: 12,
            timeSpent: 20,
            sessionType: "review",
          },
          {
            id: "2",
            date: "2024-01-15",
            cardsStudied: 10,
            correctAnswers: 8,
            timeSpent: 15,
            sessionType: "mixed",
          },
          {
            id: "3",
            date: "2024-01-14",
            cardsStudied: 8,
            correctAnswers: 7,
            timeSpent: 12,
            sessionType: "new",
          },
        ]

        setFlashcards(mockFlashcards)
        setStudySessions(mockSessions)
      } catch {
        setError("Failed to load flashcard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { flashcards, studySessions, loading, error, setFlashcards, setStudySessions }
}

const useStudySession = () => {
  const [isStudying, setIsStudying] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyCards, setStudyCards] = useState<Flashcard[]>([])
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    startTime: Date.now(),
    cardsReviewed: 0,
  })

  const startSession = useCallback((cards: Flashcard[]) => {
    if (cards.length === 0) return false

    setStudyCards([...cards].sort(() => Math.random() - 0.5)) // Shuffle cards
    setIsStudying(true)
    setCurrentCard(0)
    setShowAnswer(false)
    setSessionStats({
      correct: 0,
      incorrect: 0,
      startTime: Date.now(),
      cardsReviewed: 0,
    })
    return true
  }, [])

  const endSession = useCallback(() => {
    setIsStudying(false)
    setCurrentCard(0)
    setShowAnswer(false)
    setStudyCards([])

    const timeSpent = Math.round((Date.now() - sessionStats.startTime) / 60000)
    return {
      ...sessionStats,
      timeSpent,
      accuracy: sessionStats.cardsReviewed > 0 ? (sessionStats.correct / sessionStats.cardsReviewed) * 100 : 0,
    }
  }, [sessionStats])

  const nextCard = useCallback(() => {
    if (currentCard < studyCards.length - 1) {
      setCurrentCard((prev) => prev + 1)
      setShowAnswer(false)
    } else {
      return endSession()
    }
  }, [currentCard, studyCards.length, endSession])

  const answerCard = useCallback(
    (correct: boolean) => {
      setSessionStats((prev) => ({
        ...prev,
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
        cardsReviewed: prev.cardsReviewed + 1,
      }))

      // Update card statistics (simplified spaced repetition)
      const card = studyCards[currentCard]
      if (card) {
        const updatedCard = { ...card }
        updatedCard.reviewCount++
        updatedCard.lastReviewed = new Date().toISOString()

        if (correct) {
          updatedCard.correctCount++
          updatedCard.interval = Math.min(updatedCard.interval * updatedCard.easeFactor, 365)
          updatedCard.easeFactor = Math.min(updatedCard.easeFactor + 0.1, 3.0)
        } else {
          updatedCard.incorrectCount++
          updatedCard.interval = 1
          updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.2, 1.3)
        }

        const nextReview = new Date()
        nextReview.setDate(nextReview.getDate() + updatedCard.interval)
        updatedCard.nextReview = nextReview.toISOString()

        // This would typically update the main flashcards array
      }

      setTimeout(() => nextCard(), 1000) // Brief delay before next card
    },
    [studyCards, currentCard, nextCard],
  )

  return {
    isStudying,
    currentCard,
    showAnswer,
    setShowAnswer,
    studyCards,
    sessionStats,
    startSession,
    endSession,
    nextCard,
    answerCard,
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

const calculateStats = (flashcards: Flashcard[]): StudyStats => {
  const now = new Date()
  const dueCards = flashcards.filter((card) => new Date(card.nextReview) <= now)
  const newCards = flashcards.filter((card) => card.reviewCount === 0)
  const masteredCards = flashcards.filter(
    (card) => card.reviewCount >= 5 && card.correctCount / card.reviewCount >= 0.8,
  )

  const totalReviews = flashcards.reduce((acc, card) => acc + card.reviewCount, 0)
  const totalCorrect = flashcards.reduce((acc, card) => acc + card.correctCount, 0)
  const averageAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0

  return {
    totalCards: flashcards.length,
    dueCards: dueCards.length,
    newCards: newCards.length,
    masteredCards: masteredCards.length,
    averageAccuracy,
    totalReviews,
    studyStreak: 7, // Mock data
    timeSpent: 145, // Mock data in minutes
  }
}

const speakText = (text: string, lang = "ar-SA") => {
  if ("speechSynthesis" in window) {
    // Cancel any ongoing speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.8
    utterance.pitch = 1
    speechSynthesis.speak(utterance)
  }
}

// Components
const FlashcardStats = ({ stats }: { stats: StudyStats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-2xl font-bold">{stats.totalCards}</div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          <div>
            <div className="text-2xl font-bold">{stats.dueCards}</div>
            <div className="text-sm text-muted-foreground">Due for Review</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          <div>
            <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-600" />
          <div>
            <div className="text-2xl font-bold">{stats.masteredCards}</div>
            <div className="text-sm text-muted-foreground">Mastered</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

const StudyModeSelector = ({
  flashcards,
  onStartSession,
}: {
  flashcards: Flashcard[]
  onStartSession: (cards: Flashcard[]) => void
  dictionary: Record<string, unknown>
}) => {
  const [studyMode, setStudyMode] = useState<"due" | "new" | "all" | "starred">("due")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [maxCards, setMaxCards] = useState("20")

  const categories = useMemo(() => Array.from(new Set(flashcards.map((card) => card.category))).sort(), [flashcards])

  const getStudyCards = useCallback(() => {
    let cards = flashcards

    // Filter by study mode
    const now = new Date()
    switch (studyMode) {
      case "due":
        cards = cards.filter((card) => new Date(card.nextReview) <= now)
        break
      case "new":
        cards = cards.filter((card) => card.reviewCount === 0)
        break
      case "starred":
        cards = cards.filter((card) => card.isStarred)
        break
      case "all":
      default:
        // No additional filtering
        break
    }

    // Filter by category
    if (selectedCategory !== "all") {
      cards = cards.filter((card) => card.category === selectedCategory)
    }

    // Limit number of cards
    const limit = Number.parseInt(maxCards) || 20
    return cards.slice(0, limit)
  }, [flashcards, studyMode, selectedCategory, maxCards])

  const studyCards = getStudyCards()

  const handleStartSession = () => {
    if (studyCards.length === 0) {
      return
    }
    onStartSession(studyCards)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Study Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="study-mode">Study Mode</Label>
            <Select value={studyMode} onValueChange={(value: "due" | "new" | "all" | "starred") => setStudyMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due">
                  Due Cards ({flashcards.filter((c) => new Date(c.nextReview) <= new Date()).length})
                </SelectItem>
                <SelectItem value="new">New Cards ({flashcards.filter((c) => c.reviewCount === 0).length})</SelectItem>
                <SelectItem value="starred">Starred Cards ({flashcards.filter((c) => c.isStarred).length})</SelectItem>
                <SelectItem value="all">All Cards ({flashcards.length})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
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
          </div>

          <div>
            <Label htmlFor="max-cards">Max Cards</Label>
            <Select value={maxCards} onValueChange={setMaxCards}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 cards</SelectItem>
                <SelectItem value="20">20 cards</SelectItem>
                <SelectItem value="30">30 cards</SelectItem>
                <SelectItem value="50">50 cards</SelectItem>
                <SelectItem value="100">100 cards</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="text-lg">
            Ready to study <strong>{studyCards.length}</strong> cards
          </div>
          <Button onClick={handleStartSession} size="lg" disabled={studyCards.length === 0} className="gap-2">
            <Play className="h-5 w-5" />
            Start Study Session
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const StudyInterface = ({
  studyCards,
  currentCard,
  showAnswer,
  setShowAnswer,
  sessionStats,
  onAnswer,
  onEndSession,
}: {
  studyCards: Flashcard[]
  currentCard: number
  showAnswer: boolean
  setShowAnswer: (show: boolean) => void
  sessionStats: { correct: number; incorrect: number; cardsReviewed: number }
  onAnswer: (correct: boolean) => void
  onEndSession: () => void
}) => {
  const card = studyCards[currentCard]
  const progress = ((currentCard + 1) / studyCards.length) * 100

  if (!card) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Cards Available</h3>
        <p className="text-muted-foreground mb-4">No cards match your current study criteria</p>
        <Button onClick={onEndSession}>End Session</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Card {currentCard + 1} of {studyCards.length}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-green-600">✓ {sessionStats.correct}</span>
                  <span className="mx-2">•</span>
                  <span className="text-red-600">✗ {sessionStats.incorrect}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onEndSession}>
                  End Session
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Flashcard */}
      <Card className="min-h-[500px]">
        <CardContent className="pt-6 h-full flex flex-col justify-center">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <div className="flex justify-center gap-2">
                <Badge className={getDifficultyColor(card.difficulty)}>{card.difficulty}</Badge>
                <Badge variant="secondary">{card.category}</Badge>
                {card.isStarred && (
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3" />
                    Starred
                  </Badge>
                )}
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {card.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-4xl font-bold p-8 bg-muted/30 rounded-lg min-h-[120px] flex items-center justify-center">
                <div className="flex items-center gap-4">
                  {card.front}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(card.front)}
                    className="opacity-60 hover:opacity-100"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {showAnswer && (
                <div className="text-lg text-muted-foreground p-6 bg-primary/5 rounded-lg border-2 border-primary/20 min-h-[100px] flex items-center justify-center">
                  <div className="max-w-2xl">{card.back}</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {!showAnswer ? (
                <Button onClick={() => setShowAnswer(true)} size="lg" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Show Answer
                </Button>
              ) : (
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => onAnswer(false)}
                    variant="destructive"
                    size="lg"
                    className="gap-2 min-w-[120px]"
                  >
                    <X className="h-5 w-5" />
                    Incorrect
                  </Button>
                  <Button onClick={() => onAnswer(true)} size="lg" className="gap-2 min-w-[120px]">
                    <Check className="h-5 w-5" />
                    Correct
                  </Button>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <div>
                Reviewed {card.reviewCount} times •{" "}
                {card.reviewCount > 0 ? Math.round((card.correctCount / card.reviewCount) * 100) : 0}% accuracy
              </div>
              {card.lastReviewed && <div>Last reviewed: {new Date(card.lastReviewed).toLocaleDateString()}</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const CreateCardDialog = ({
  open,
  onOpenChange,
  onCreateCard,
  categories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCard: (card: Partial<Flashcard>) => void
  categories: string[]
}) => {
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    category: "vocabulary",
    difficulty: "easy",
    tags: "",
  })

  const handleSubmit = useCallback(() => {
    if (!formData.front.trim() || !formData.back.trim()) {
      return
    }

    const newCard: Partial<Flashcard> = {
      front: formData.front.trim(),
      back: formData.back.trim(),
      category: formData.category,
      difficulty: formData.difficulty as Flashcard["difficulty"],
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      reviewCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      nextReview: new Date().toISOString(),
      interval: 1,
      easeFactor: 2.5,
      isStarred: false,
    }

    onCreateCard(newCard)
    setFormData({
      front: "",
      back: "",
      category: "vocabulary",
      difficulty: "easy",
      tags: "",
    })
    onOpenChange(false)
  }, [formData, onCreateCard, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Flashcard</DialogTitle>
          <DialogDescription>Add a new flashcard to your collection for spaced repetition learning</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="front">Front (Arabic) *</Label>
            <Textarea
              id="front"
              placeholder="Enter Arabic text, word, or phrase"
              value={formData.front}
              onChange={(e) => setFormData((prev) => ({ ...prev, front: e.target.value }))}
              className="text-lg"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="back">Back (Translation/Explanation) *</Label>
            <Textarea
              id="back"
              placeholder="Enter translation, explanation, or additional context"
              value={formData.back}
              onChange={(e) => setFormData((prev) => ({ ...prev, back: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="phrases">Phrases</SelectItem>
                  <SelectItem value="pronunciation">Pronunciation</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
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
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="greetings, basic, common, formal"
              value={formData.tags}
              onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.front.trim() || !formData.back.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Card
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const FlashcardBrowser = ({
  flashcards,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  onEditCard,
  onDeleteCard,
  onToggleStar,
}: {
  flashcards: Flashcard[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: string[]
  onEditCard: (card: Flashcard) => void
  onDeleteCard: (cardId: string) => void
  onToggleStar: (cardId: string) => void
}) => {
  const [sortBy, setSortBy] = useState<"created" | "reviewed" | "difficulty" | "accuracy">("created")

  const filteredAndSortedCards = useMemo(() => {
    const filtered = flashcards.filter((card) => {
      const matchesSearch =
        card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.back.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || card.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "reviewed":
          return new Date(b.lastReviewed || 0).getTime() - new Date(a.lastReviewed || 0).getTime()
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case "accuracy":
          const aAccuracy = a.reviewCount > 0 ? a.correctCount / a.reviewCount : 0
          const bAccuracy = b.reviewCount > 0 ? b.correctCount / b.reviewCount : 0
          return bAccuracy - aAccuracy
        case "created":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [flashcards, searchQuery, selectedCategory, sortBy])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search flashcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
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

              <Select value={sortBy} onValueChange={(value: "created" | "reviewed" | "difficulty" | "accuracy") => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Newest First</SelectItem>
                  <SelectItem value="reviewed">Recently Reviewed</SelectItem>
                  <SelectItem value="difficulty">By Difficulty</SelectItem>
                  <SelectItem value="accuracy">By Accuracy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Grid */}
      {filteredAndSortedCards.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Cards Found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCards.map((card) => (
            <Card key={card.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(card.difficulty)}>{card.difficulty}</Badge>
                      <Badge variant="secondary">{card.category}</Badge>
                      {card.isStarred && (
                        <Badge variant="outline" className="gap-1">
                          <Zap className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {card.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {card.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{card.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStar(card.id)}
                      className={card.isStarred ? "text-yellow-500" : ""}
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEditCard(card)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCard(card.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="text-lg font-bold text-center p-4 bg-muted/30 rounded min-h-[80px] flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      {card.front}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(card.front)}
                        className="opacity-60 hover:opacity-100"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center text-muted-foreground p-3 bg-primary/5 rounded min-h-[60px] flex items-center justify-center text-sm">
                    {card.back.length > 100 ? `${card.back.substring(0, 100)}...` : card.back}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Reviews</div>
                    <div className="text-muted-foreground">{card.reviewCount}</div>
                  </div>
                  <div>
                    <div className="font-medium">Accuracy</div>
                    <div className="text-muted-foreground">
                      {card.reviewCount > 0 ? Math.round((card.correctCount / card.reviewCount) * 100) : 0}%
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Next Review</div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(card.nextReview) <= new Date()
                        ? "Due now"
                        : new Date(card.nextReview).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Interval</div>
                    <div className="text-muted-foreground">
                      {card.interval} day{card.interval !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Main component
export function FlashcardSystem({ lang, dictionary }: FlashcardSystemProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("study")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const { flashcards, studySessions, loading, error, setFlashcards, setStudySessions } = useFlashcardData()
  const stats = useMemo(() => calculateStats(flashcards), [flashcards])

  const categories = useMemo(() => Array.from(new Set(flashcards.map((card) => card.category))).sort(), [flashcards])

  const {
    isStudying,
    currentCard,
    showAnswer,
    setShowAnswer,
    studyCards,
    sessionStats,
    startSession,
    endSession,
    answerCard,
  } = useStudySession()

  const handleStartSession = useCallback(
    (cards: Flashcard[]) => {
      const success = startSession(cards)
      if (!success) {
        toast({
          title: "No Cards Available",
          description: "No cards are available for the selected criteria",
          variant: "destructive",
        })
      }
    },
    [startSession, toast],
  )

  const handleEndSession = useCallback(() => {
    const results = endSession()

    // Create new study session record
    const newSession: StudySession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      cardsStudied: results.cardsReviewed,
      correctAnswers: results.correct,
      timeSpent: results.timeSpent,
      sessionType: "mixed",
    }

    setStudySessions((prev) => [newSession, ...prev])

    toast({
      title: "Study Session Complete!",
      description: `You studied ${results.cardsReviewed} cards with ${Math.round(results.accuracy)}% accuracy`,
    })
  }, [endSession, setStudySessions, toast])

  const handleCreateCard = useCallback(
    (newCardData: Partial<Flashcard>) => {
      const card: Flashcard = {
        id: Date.now().toString(),
        front: newCardData.front || "",
        back: newCardData.back || "",
        category: newCardData.category || "vocabulary",
        difficulty: newCardData.difficulty || "easy",
        tags: newCardData.tags || [],
        createdAt: newCardData.createdAt || new Date().toISOString(),
        reviewCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        nextReview: new Date().toISOString(),
        interval: 1,
        easeFactor: 2.5,
        isStarred: false,
      }

      setFlashcards((prev) => [card, ...prev])
      toast({
        title: "Flashcard Created",
        description: "New flashcard added to your collection",
      })
    },
    [setFlashcards, toast],
  )

  const handleEditCard = useCallback(
    () => {
      // This would open an edit dialog - simplified for now
      toast({
        title: "Edit Card",
        description: "Edit functionality would be implemented here",
      })
    },
    [toast],
  )

  const handleDeleteCard = useCallback(
    (cardId: string) => {
      setFlashcards((prev) => prev.filter((card) => card.id !== cardId))
      toast({
        title: "Card Deleted",
        description: "Flashcard has been removed from your collection",
      })
    },
    [setFlashcards, toast],
  )

  const handleToggleStar = useCallback(
    (cardId: string) => {
      setFlashcards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isStarred: !card.isStarred } : card)))
    },
    [setFlashcards],
  )

  if (loading) {
    return (
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading flashcards...</p>
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
              <h3 className="text-lg font-semibold mb-2">Error Loading Flashcards</h3>
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
                Flashcards
              </h1>
              <p className="text-muted-foreground text-lg mt-2">Master Arabic with intelligent spaced repetition</p>
            </div>

            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Card
            </Button>
          </div>

          <FlashcardStats stats={stats} />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="study" className="gap-2">
              <Play className="h-4 w-4" />
              Study
            </TabsTrigger>
            <TabsTrigger value="browse" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Browse Cards
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="study" className="space-y-6">
            {!isStudying ? (
              <StudyModeSelector flashcards={flashcards} onStartSession={handleStartSession} dictionary={dictionary} />
            ) : (
              <StudyInterface
                studyCards={studyCards}
                currentCard={currentCard}
                showAnswer={showAnswer}
                setShowAnswer={setShowAnswer}
                sessionStats={sessionStats}
                onAnswer={answerCard}
                onEndSession={handleEndSession}
              />
            )}
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <FlashcardBrowser
              flashcards={flashcards}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onToggleStar={handleToggleStar}
            />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Study Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Study Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studySessions.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">No study sessions yet</div>
                    ) : (
                      studySessions.slice(0, 5).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                          <div>
                            <div className="font-medium">{new Date(session.date).toLocaleDateString()}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.cardsStudied} cards • {session.timeSpent} minutes • {session.sessionType}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {Math.round((session.correctAnswers / session.cardsStudied) * 100)}%
                            </div>
                            <div className="text-sm text-muted-foreground">accuracy</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Cards by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const categoryCards = flashcards.filter((card) => card.category === category)
                      const percentage = flashcards.length > 0 ? (categoryCards.length / flashcards.length) * 100 : 0
                      const masteredInCategory = categoryCards.filter(
                        (card) => card.reviewCount >= 5 && card.correctCount / card.reviewCount >= 0.8,
                      ).length

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium">{category}</span>
                            <span>
                              {categoryCards.length} cards ({masteredInCategory} mastered)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <CreateCardDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreateCard={handleCreateCard}
          categories={categories}
        />
      </div>
    </AppLayout>
  )
}
