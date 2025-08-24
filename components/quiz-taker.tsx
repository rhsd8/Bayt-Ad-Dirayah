"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { AppLayout } from "@/components/app-layout"
import { Clock, ArrowLeft, ArrowRight, Flag, CheckCircle, XCircle, Trophy, Target, BookOpen } from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "multiple-select" | "fill-blank" | "true-false"
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
}

interface QuizTakerProps {
  lang: string
  quizId: string
  dictionary: Record<string, unknown>
}

export function QuizTaker({ lang, quizId, dictionary }: QuizTakerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Mock quiz data
  const quiz = {
    id: quizId,
    title: "Arabic Alphabet Mastery",
    description: "Test your knowledge of Arabic letters and their forms",
    timeLimit: 15,
    questions: [
      {
        id: "1",
        type: "multiple-choice" as const,
        question: "How many letters are in the Arabic alphabet?",
        options: ["26", "28", "30", "32"],
        correctAnswer: "28",
        explanation: "The Arabic alphabet consists of 28 letters, each with different forms depending on position.",
        points: 1,
      },
      {
        id: "2",
        type: "multiple-choice" as const,
        question: "Which letter is the first in the Arabic alphabet?",
        options: ["ب (Ba)", "أ (Alif)", "ت (Ta)", "ث (Tha)"],
        correctAnswer: "أ (Alif)",
        explanation: "Alif (أ) is the first letter of the Arabic alphabet.",
        points: 1,
      },
      {
        id: "3",
        type: "true-false" as const,
        question: "Arabic letters change form depending on their position in a word.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Arabic letters have different forms: isolated, initial, medial, and final.",
        points: 1,
      },
      {
        id: "4",
        type: "multiple-select" as const,
        question: "Which of the following are Arabic vowel marks? (Select all that apply)",
        options: ["َ (Fatha)", "ِ (Kasra)", "ُ (Damma)", "ْ (Sukun)"],
        correctAnswer: ["َ (Fatha)", "ِ (Kasra)", "ُ (Damma)"],
        explanation: "Fatha, Kasra, and Damma are vowel marks. Sukun indicates the absence of a vowel.",
        points: 2,
      },
      {
        id: "5",
        type: "fill-blank" as const,
        question: "The Arabic word for 'book' is ______.",
        correctAnswer: "كتاب",
        explanation: "كتاب (kitab) means 'book' in Arabic.",
        points: 1,
      },
    ],
  }

  // Timer effect
  useEffect(() => {
    if (!isSubmitted && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitQuiz()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [timeLeft, isSubmitted, handleSubmitQuiz])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleFlagQuestion = (questionIndex: number) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }

  const handleSubmitQuiz = useCallback(() => {
    setIsSubmitted(true)
    setShowResults(true)

    // Calculate score
    let correctAnswers = 0
    let totalPoints = 0
    let earnedPoints = 0

    quiz.questions.forEach((question) => {
      totalPoints += question.points
      const userAnswer = answers[question.id]

      if (question.type === "multiple-select") {
        const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : []
        const user = Array.isArray(userAnswer) ? userAnswer : []
        if (correct.length === user.length && correct.every((ans) => user.includes(ans))) {
          correctAnswers++
          earnedPoints += question.points
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++
          earnedPoints += question.points
        }
      }
    })

    const percentage = Math.round((earnedPoints / totalPoints) * 100)

    toast({
      title: "Quiz Completed!",
      description: `You scored ${percentage}% (${correctAnswers}/${quiz.questions.length} correct)`,
    })
  }, [answers, quiz.questions, toast])

  const renderQuestion = (question: Question) => {
    const userAnswer = answers[question.id]

    switch (question.type) {
      case "multiple-choice":
      case "true-false":
        return (
          <RadioGroup
            value={userAnswer || ""}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            disabled={isSubmitted}
          >
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                  {option}
                </Label>
                {isSubmitted && option === question.correctAnswer && <CheckCircle className="h-4 w-4 text-green-600" />}
                {isSubmitted && option === userAnswer && option !== question.correctAnswer && (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            ))}
          </RadioGroup>
        )

      case "multiple-select":
        return (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${optionIndex}`}
                  checked={Array.isArray(userAnswer) ? userAnswer.includes(option) : false}
                  onCheckedChange={(checked) => {
                    const currentAnswers = Array.isArray(userAnswer) ? userAnswer : []
                    if (checked) {
                      handleAnswerChange(question.id, [...currentAnswers, option])
                    } else {
                      handleAnswerChange(
                        question.id,
                        currentAnswers.filter((ans: string) => ans !== option),
                      )
                    }
                  }}
                  disabled={isSubmitted}
                />
                <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                  {option}
                </Label>
                {isSubmitted && Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option) && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
            ))}
          </div>
        )

      case "fill-blank":
        return (
          <div className="space-y-2">
            <Input
              value={userAnswer || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Type your answer here..."
              disabled={isSubmitted}
              className="max-w-md"
            />
            {isSubmitted && (
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Correct answer:</span>
                  <span className="text-green-600">{question.correctAnswer}</span>
                  {userAnswer === question.correctAnswer ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  if (showResults) {
    let correctAnswers = 0
    let totalPoints = 0
    let earnedPoints = 0

    quiz.questions.forEach((question) => {
      totalPoints += question.points
      const userAnswer = answers[question.id]

      if (question.type === "multiple-select") {
        const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : []
        const user = Array.isArray(userAnswer) ? userAnswer : []
        if (correct.length === user.length && correct.every((ans) => user.includes(ans))) {
          correctAnswers++
          earnedPoints += question.points
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++
          earnedPoints += question.points
        }
      }
    })

    const percentage = Math.round((earnedPoints / totalPoints) * 100)

    return (
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-primary">{percentage}%</div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{quiz.questions.length - correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((quiz.timeLimit * 60 - timeLeft) / 60)}m
                  </div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Score: {earnedPoints}/{totalPoints} points
                  </span>
                  <span>{percentage >= 70 ? "Passed" : "Failed"}</span>
                </div>
                <Progress value={percentage} className="h-3" />
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push(`/${lang}/quiz`)} variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Back to Quizzes
                </Button>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id]
                let isCorrect = false

                if (question.type === "multiple-select") {
                  const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : []
                  const user = Array.isArray(userAnswer) ? userAnswer : []
                  isCorrect = correct.length === user.length && correct.every((ans) => user.includes(ans))
                } else {
                  isCorrect = userAnswer === question.correctAnswer
                }

                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Question {index + 1}</span>
                          <Badge variant={isCorrect ? "default" : "destructive"}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ({question.points} point{question.points > 1 ? "s" : ""})
                          </span>
                        </div>
                        <p className="text-sm mb-3">{question.question}</p>
                      </div>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Your answer: </span>
                        <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer || "No answer"}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="font-medium">Correct answer: </span>
                          <span className="text-green-600">
                            {Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.join(", ")
                              : question.correctAnswer}
                          </span>
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        <span className="font-medium">Explanation: </span>
                        {question.explanation}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout lang={lang} dictionary={dictionary}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push(`/${lang}/quiz`)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={timeLeft < 300 ? "text-red-600 font-bold" : ""}>{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="secondary">
              {answeredQuestions}/{quiz.questions.length} answered
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Question {currentQuestion + 1}
                {flaggedQuestions.has(currentQuestion) && <Flag className="inline h-5 w-5 ml-2 text-yellow-600" />}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFlagQuestion(currentQuestion)}
                  className={flaggedQuestions.has(currentQuestion) ? "text-yellow-600" : ""}
                >
                  <Flag className="h-4 w-4" />
                  {flaggedQuestions.has(currentQuestion) ? "Unflag" : "Flag"}
                </Button>
                <Badge variant="outline">
                  {currentQ.points} point{currentQ.points > 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{currentQ.question}</p>
            {renderQuestion(currentQ)}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button onClick={handleSubmitQuiz} className="gap-2">
                <Target className="h-4 w-4" />
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {quiz.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestion(index)}
                  className={`relative ${answers[quiz.questions[index].id] ? "bg-green-50 border-green-200" : ""}`}
                >
                  {index + 1}
                  {flaggedQuestions.has(index) && <Flag className="absolute -top-1 -right-1 h-3 w-3 text-yellow-600" />}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
