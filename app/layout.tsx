import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Harf Project - Learn Arabic Online | Interactive Arabic Learning Platform',
    template: '%s | Harf Project'
  },
  description: 'Master Arabic with Harf Project - the comprehensive online platform for learning Arabic. Interactive lessons, flashcards, quizzes, and progress tracking. Start your Arabic learning journey today!',
  keywords: [
    'learn Arabic online',
    'Arabic learning platform',
    'Arabic courses',
    'Arabic lessons',
    'Arabic grammar',
    'Arabic vocabulary',
    'Arabic pronunciation',
    'Arabic writing',
    'Arabic reading',
    'Arabic speaking',
    'online education',
    'language learning',
    'Arabic for beginners',
    'Arabic teaching',
    'Arabic study',
    'multilingual learning'
  ],
  authors: [{ name: 'Harf Project Team' }],
  creator: 'Harf Project',
  publisher: 'Harf Project',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_SA', 'fr_FR'],
    url: siteUrl,
    siteName: 'Harf Project',
    title: 'Harf Project - Learn Arabic Online | Interactive Arabic Learning Platform',
    description: 'Master Arabic with Harf Project - the comprehensive online platform for learning Arabic. Interactive lessons, flashcards, quizzes, and progress tracking.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Harf Project - Learn Arabic Online',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 800,
        height: 800,
        alt: 'Harf Project Logo',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@harfproject',
    creator: '@harfproject',
    title: 'Harf Project - Learn Arabic Online',
    description: 'Master Arabic with interactive lessons, flashcards, and quizzes. Start your Arabic learning journey today!',
    images: ['/twitter-image.jpg'],
  },
  robots: {
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
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': `${siteUrl}/en`,
      'ar': `${siteUrl}/ar`,
      'fr': `${siteUrl}/fr`,
      'x-default': `${siteUrl}/en`,
    },
  },
  category: 'education',
  classification: 'Education, Language Learning',
  referrer: 'origin-when-cross-origin',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Harf Project" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Harf Project" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Preconnect to important third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Harf Project',
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
              offers: {
                '@type': 'Course',
                name: 'Arabic Language Learning',
                description: 'Complete Arabic learning program from beginner to advanced levels',
                provider: {
                  '@type': 'EducationalOrganization',
                  name: 'Harf Project',
                },
                educationalLevel: 'Beginner to Advanced',
                inLanguage: 'Arabic',
                teaches: 'Arabic Language',
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
