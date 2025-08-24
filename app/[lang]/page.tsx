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

  const dictionary = await getDictionary(currentLang as "en" | "ar" | "fr")

  return <LandingPage lang={currentLang} dictionary={dictionary} />
}
