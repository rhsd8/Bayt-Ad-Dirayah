import { getDictionary } from "./dictionaries"
import { LandingPage } from "@/components/landing-page"

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params

  // Validate language parameter
  const validLangs = ["en", "ar", "fr"]
  const currentLang = validLangs.includes(lang) ? lang : "en"

  let dictionary
  try {
    dictionary = await getDictionary(currentLang as "en" | "ar" | "fr")
  } catch (error) {
    console.error("Failed to load dictionary for landing page:", error)
    // Provide minimal fallback
    dictionary = {
      common: { getStarted: "Get Started" },
      navigation: { home: "Home", features: "Features", courses: "Courses" },
      landing: {
        hero: {
          title: "Master Arabic Language",
          subtitle: "Professional Learning Platform",
          description: "Join thousands of students learning Arabic through our comprehensive interactive courses.",
          cta: "Start Learning Today",
          watchDemo: "Watch Demo",
        },
      },
    }
  }

  return <LandingPage lang={currentLang} dictionary={dictionary} />
}
