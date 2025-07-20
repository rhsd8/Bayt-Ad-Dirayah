import { getDictionary } from "../dictionaries"
import { FlashcardSystem } from "@/components/flashcard-system"

interface FlashcardsPageProps {
  params: Promise<{ lang: string }>
}

export default async function FlashcardsPage({ params }: FlashcardsPageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang as "en" | "ar" | "fr")

  return <FlashcardSystem lang={lang} dictionary={dictionary} />
}
