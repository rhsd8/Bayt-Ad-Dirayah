import { getDictionary } from "../dictionaries"
import { QuizSystem } from "@/components/quiz-system"

interface QuizPageProps {
  params: Promise<{ lang: string }>
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang as "en" | "ar" | "fr")

  return <QuizSystem lang={lang} dictionary={dictionary} />
}
