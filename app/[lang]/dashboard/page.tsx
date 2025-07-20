import { getDictionary } from "../dictionaries"
import { Dashboard } from "@/components/dashboard"

interface DashboardPageProps {
  params: Promise<{ lang: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = await params

  // Validate language parameter
  const validLangs = ["en", "ar", "fr"]
  const currentLang = validLangs.includes(lang) ? lang : "en"

  let dictionary
  try {
    dictionary = await getDictionary(currentLang as "en" | "ar" | "fr")
  } catch (error) {
    console.error("Failed to load dictionary for dashboard:", error)
    // Provide minimal fallback
    dictionary = {
      common: {},
      navigation: {},
      dashboard: {
        welcome_message: "Welcome back!",
        subtitle: "Continue your learning journey",
      },
    }
  }

  return <Dashboard lang={currentLang} dictionary={dictionary} />
}
