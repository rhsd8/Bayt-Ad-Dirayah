import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'
const siteName = 'Harf Project'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'course' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  locale?: string
  alternateLocales?: string[]
  noIndex?: boolean
  canonicalUrl?: string
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  locale = 'en',
  alternateLocales = ['ar', 'fr'],
  noIndex = false,
  canonicalUrl,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Learn Arabic Online | Interactive Arabic Learning Platform`
  const fullDescription = description || 'Master Arabic with Harf Project - the comprehensive online platform for learning Arabic. Interactive lessons, flashcards, quizzes, and progress tracking.'
  const fullUrl = url || siteUrl
  const imageUrl = image || '/og-image.jpg'
  const canonical = canonicalUrl || fullUrl

  const allKeywords = [
    'learn Arabic online',
    'Arabic learning platform',
    'Arabic courses',
    'Arabic lessons',
    ...keywords,
  ]

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      locale: getOpenGraphLocale(locale),
      alternateLocale: alternateLocales.map(getOpenGraphLocale),
      url: fullUrl,
      siteName,
      title: fullTitle,
      description: fullDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || 'Harf Project - Learn Arabic Online',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@harfproject',
      creator: '@harfproject',
      title: fullTitle,
      description: fullDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical,
      languages: {
        'en': `${siteUrl}/en${url?.replace(siteUrl, '') || ''}`,
        'ar': `${siteUrl}/ar${url?.replace(siteUrl, '') || ''}`,
        'fr': `${siteUrl}/fr${url?.replace(siteUrl, '') || ''}`,
        'x-default': `${siteUrl}/en${url?.replace(siteUrl, '') || ''}`,
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }

  // Add article-specific metadata
  if (type === 'article' && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      publishedTime,
      modifiedTime,
      authors: ['Harf Project Team'],
    }
  }

  return metadata
}

function getOpenGraphLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    en: 'en_US',
    ar: 'ar_SA',
    fr: 'fr_FR',
  }
  return localeMap[locale] || 'en_US'
}

// Common structured data schemas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: 'Comprehensive online platform for learning Arabic with interactive lessons, flashcards, and progress tracking.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Arabic', 'French'],
  },
  sameAs: [
    'https://twitter.com/harfproject',
    'https://facebook.com/harfproject',
    'https://instagram.com/harfproject',
  ],
}

export function generateCourseSchema(courseData: {
  name: string
  description: string
  url: string
  image?: string
  instructor?: string
  duration?: string
  difficulty?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: courseData.name,
    description: courseData.description,
    url: courseData.url,
    image: courseData.image,
    provider: {
      '@type': 'EducationalOrganization',
      name: siteName,
      url: siteUrl,
    },
    instructor: courseData.instructor ? {
      '@type': 'Person',
      name: courseData.instructor,
    } : undefined,
    coursePrerequisites: 'No prerequisites required',
    educationalLevel: courseData.difficulty || 'Beginner',
    inLanguage: 'Arabic',
    teaches: 'Arabic Language',
    timeRequired: courseData.duration,
  }
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: 'Learn Arabic online with interactive lessons, flashcards, and personalized learning paths.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://twitter.com/harfproject',
      'https://facebook.com/harfproject',
      'https://instagram.com/harfproject',
    ],
  }
}