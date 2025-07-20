import { getDictionary } from "../../dictionaries"
import { QuizTaker } from "@/components/quiz-taker"

interface QuizTakerPageProps {
  params: Promise<{ lang: string; quizId: string }>
}

export default async function QuizTakerPage({ params }: QuizTakerPageProps) {
  const { lang, quizId } = await params
  const dictionary = await getDictionary(lang as "en" | "ar" | "fr")

  return <QuizTaker lang={lang} quizId={quizId} dictionary={dictionary} />
}
