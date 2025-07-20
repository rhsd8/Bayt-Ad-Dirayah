import { getDictionary } from "../dictionaries"
import { NotesSystem } from "@/components/notes-system"

interface NotesPageProps {
  params: Promise<{ lang: string }>
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang as "en" | "ar" | "fr")

  return <NotesSystem lang={lang} dictionary={dictionary} />
}
