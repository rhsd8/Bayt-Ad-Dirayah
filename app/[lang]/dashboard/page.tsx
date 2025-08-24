import { getDictionary } from "../dictionaries"
import { Dashboard } from "@/components/dashboard"
import { ProtectedRoute } from "@/components/protected-route"

interface DashboardPageProps {
  params: Promise<{ lang: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = await params

  // Validate language parameter
  const validLangs = ["en", "ar", "fr"]
  const currentLang = validLangs.includes(lang) ? lang : "en"

  const dictionary = await getDictionary(currentLang as "en" | "ar" | "fr")

  return (
    <ProtectedRoute lang={currentLang}>
      <Dashboard lang={currentLang} dictionary={dictionary} />
    </ProtectedRoute>
  )
}
