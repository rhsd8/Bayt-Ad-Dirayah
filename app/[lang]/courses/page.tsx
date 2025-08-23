import { CoursesPage } from "@/components/courses-page"
import { getDictionary } from "../dictionaries"
import { generateSEOMetadata } from "@/lib/seo"
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'
  
  const titles: Record<string, string> = {
    en: 'Arabic Courses - Learn Arabic Online | Harf Project',
    ar: 'دورات العربية - تعلم العربية عبر الإنترنت',
    fr: 'Cours d\'Arabe - Apprendre l\'Arabe en Ligne',
  }
  
  const descriptions: Record<string, string> = {
    en: 'Comprehensive Arabic courses for all levels. From beginner to advanced Arabic lessons with interactive content, quizzes, and personalized learning paths.',
    ar: 'دورات عربية شاملة لجميع المستويات. من الدروس العربية للمبتدئين إلى المتقدمين مع محتوى تفاعلي واختبارات ومسارات تعلم شخصية.',
    fr: 'Cours d\'arabe complets pour tous les niveaux. Des leçons d\'arabe débutant à avancé avec contenu interactif, quiz et parcours d\'apprentissage personnalisés.',
  }

  return generateSEOMetadata({
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: [
      'Arabic courses',
      'Arabic lessons online',
      'learn Arabic course',
      'Arabic beginner course',
      'Arabic advanced course',
      'Arabic language course',
      'online Arabic classes',
      'Arabic grammar course',
      'Arabic vocabulary lessons',
      'Modern Standard Arabic course',
      'Arabic writing course',
      'Arabic speaking course',
    ],
    url: `${siteUrl}/${lang}/courses`,
    locale: lang,
    type: 'website',
  })
}

export default async function Courses({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as "en" | "ar" | "fr")

  return <CoursesPage lang={lang} dictionary={dict} />
}
