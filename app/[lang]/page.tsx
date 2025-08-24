import { getDictionary } from "./dictionaries"
import { LandingPage } from "@/components/landing-page"
import { generateSEOMetadata } from "@/lib/seo"
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const validLangs = ["en", "ar", "fr"]
  const currentLang = validLangs.includes(lang) ? lang : "en"
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'
  
  const titles: Record<string, string> = {
    en: 'Learn Arabic Online - Interactive Arabic Learning Platform',
    ar: 'تعلم العربية عبر الإنترنت - منصة تعلم العربية التفاعلية',
    fr: 'Apprendre l\'Arabe en Ligne - Plateforme d\'Apprentissage Interactive',
  }
  
  const descriptions: Record<string, string> = {
    en: 'Master Arabic with Harf Project\'s comprehensive online platform. Interactive lessons, personalized learning paths, flashcards, and progress tracking. Start your Arabic journey today!',
    ar: 'أتقن اللغة العربية مع منصة مشروع حرف الشاملة عبر الإنترنت. دروس تفاعلية ومسارات تعلم شخصية وبطاقات تعليمية وتتبع التقدم.',
    fr: 'Maîtrisez l\'arabe avec la plateforme en ligne complète de Harf Project. Cours interactifs, parcours d\'apprentissage personnalisés et suivi des progrès.',
  }

  return generateSEOMetadata({
    title: titles[currentLang] || titles.en,
    description: descriptions[currentLang] || descriptions.en,
    keywords: [
      'Arabic online course',
      'learn Arabic',
      'Arabic language learning',
      'Arabic grammar',
      'Arabic vocabulary',
      'interactive Arabic lessons',
      'Arabic for beginners',
      'Arabic language course',
      'online Arabic tutor',
      'Arabic learning app',
      'Modern Standard Arabic',
      'Arabic alphabet',
      'Arabic pronunciation',
      'Arabic writing system',
    ],
    url: `${siteUrl}/${currentLang}`,
    locale: currentLang,
    type: 'website',
  })
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params

  // Validate language parameter
  const validLangs = ["en", "ar", "fr"]
  const currentLang = validLangs.includes(lang) ? lang : "en"

  const dictionary = await getDictionary(currentLang as "en" | "ar" | "fr")

  return <LandingPage lang={currentLang} dictionary={dictionary} />
}
