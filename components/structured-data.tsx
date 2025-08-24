import Script from 'next/script'

interface StructuredDataProps {
  data: Record<string, unknown>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface BreadcrumbProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbStructuredData({ items }: BreadcrumbProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <StructuredData data={schema} />
}

interface CourseProps {
  name: string
  description: string
  url: string
  image?: string
  instructor?: string
  duration?: string
  difficulty?: string
  price?: string
  currency?: string
}

export function CourseStructuredData(props: CourseProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: props.name,
    description: props.description,
    url: props.url,
    image: props.image,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Harf Project',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
    },
    instructor: props.instructor ? {
      '@type': 'Person',
      name: props.instructor,
    } : {
      '@type': 'Organization',
      name: 'Harf Project Team',
    },
    coursePrerequisites: 'No prerequisites required',
    educationalLevel: props.difficulty || 'Beginner to Advanced',
    inLanguage: 'Arabic',
    teaches: 'Arabic Language',
    timeRequired: props.duration,
    offers: props.price ? {
      '@type': 'Offer',
      price: props.price,
      priceCurrency: props.currency || 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    } : {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }

  return <StructuredData data={schema} />
}

interface OrganizationProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  contactEmail?: string
  socialLinks?: string[]
}

export function OrganizationStructuredData(props: OrganizationProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: props.name || 'Harf Project',
    url: props.url || siteUrl,
    logo: props.logo || `${siteUrl}/logo.png`,
    description: props.description || 'Comprehensive online platform for learning Arabic with interactive lessons, flashcards, and progress tracking.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: props.contactEmail,
      availableLanguage: ['English', 'Arabic', 'French'],
    },
    sameAs: props.socialLinks || [
      'https://twitter.com/harfproject',
      'https://facebook.com/harfproject',
      'https://instagram.com/harfproject',
    ],
    offers: {
      '@type': 'EducationalOccupationalProgram',
      name: 'Arabic Language Learning Program',
      description: 'Comprehensive Arabic learning program from beginner to advanced levels',
      educationalProgramMode: 'Online',
      timeToComplete: 'P6M', // 6 months
      occupationalCategory: 'Language Learning',
    },
  }

  return <StructuredData data={schema} />
}

interface WebsiteProps {
  name?: string
  url?: string
  description?: string
  searchUrl?: string
}

export function WebsiteStructuredData(props: WebsiteProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: props.name || 'Harf Project',
    url: props.url || siteUrl,
    description: props.description || 'Learn Arabic online with interactive lessons, flashcards, and personalized learning paths.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: props.searchUrl || `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Harf Project',
      logo: `${siteUrl}/logo.png`,
    },
  }

  return <StructuredData data={schema} />
}

interface FAQProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQStructuredData({ questions }: FAQProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  return <StructuredData data={schema} />
}

interface ReviewProps {
  itemName: string
  rating: number
  reviewCount: number
  reviews?: Array<{
    author: string
    rating: number
    text: string
    date: string
  }>
}

export function ReviewStructuredData({ itemName, rating, reviewCount, reviews }: ReviewProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews?.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.text,
      datePublished: review.date,
    })),
  }

  return <StructuredData data={schema} />
}