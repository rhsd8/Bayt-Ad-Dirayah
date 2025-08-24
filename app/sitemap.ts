import { MetadataRoute } from 'next'

const locales = ['en', 'ar', 'fr']

// Define your site's pages
const staticRoutes = [
  '',
  '/courses',
  '/materials',
  '/quiz',
  '/flashcards',
  '/notes',
  '/progress',
  '/community',
  '/contact',
  '/login',
  '/signup',
]

// Protected routes (require authentication)
const protectedRoutes = [
  '/dashboard',
  '/admin',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'
  
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes for all locales
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((lang) => [
              lang === 'en' ? 'x-default' : lang,
              `${baseUrl}/${lang}${route}`
            ])
          )
        }
      })
    })
  })

  // Add protected routes (indexed but require authentication)
  protectedRoutes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((lang) => [
              lang === 'en' ? 'x-default' : lang,
              `${baseUrl}/${lang}${route}`
            ])
          )
        }
      })
    })
  })

  // Add dynamic course routes (example IDs - in production, fetch from database)
  const courseIds = ['arabic-basics', 'intermediate-arabic', 'advanced-conversation']
  courseIds.forEach((courseId) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/courses/${courseId}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((lang) => [
              lang === 'en' ? 'x-default' : lang,
              `${baseUrl}/${lang}/courses/${courseId}`
            ])
          )
        }
      })
    })
  })

  // Add dynamic material routes (example IDs)
  const materialIds = ['pdf-guide-1', 'video-lesson-1', 'audio-practice-1']
  materialIds.forEach((materialId) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/materials/${materialId}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((lang) => [
              lang === 'en' ? 'x-default' : lang,
              `${baseUrl}/${lang}/materials/${materialId}`
            ])
          )
        }
      })
    })
  })

  // Add dynamic quiz routes (example IDs)
  const quizIds = ['beginner-vocabulary', 'grammar-test-1', 'pronunciation-check']
  quizIds.forEach((quizId) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/quiz/${quizId}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: {
          languages: Object.fromEntries(
            locales.map((lang) => [
              lang === 'en' ? 'x-default' : lang,
              `${baseUrl}/${lang}/quiz/${quizId}`
            ])
          )
        }
      })
    })
  })

  return sitemapEntries
}