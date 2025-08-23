import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://harfproject.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Harf Project - Learn Arabic Online | Interactive Arabic Learning Platform',
    template: '%s | Harf Project'
  },
  description: 'Master Arabic with Harf Project - an interactive online learning platform featuring courses, flashcards, quizzes, and community support. Start your Arabic journey today!',
  keywords: ['Arabic learning', 'online Arabic course', 'Arabic language', 'interactive learning', 'Arabic flashcards', 'Arabic quiz'],
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
    title: 'Harf Project - Learn Arabic Online',
    description: 'Master Arabic with interactive courses, flashcards, and community support',
    images: [
      {
        url: `${siteUrl}/logo-web-light-en.webp`,
        width: 1200,
        height: 630,
        alt: 'Harf Project - Learn Arabic Online',
      }
    ],
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
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': `${siteUrl}/en`,
      'ar': `${siteUrl}/ar`,
      'fr': `${siteUrl}/fr`,
    },
  },
  category: 'education',
  classification: 'Education',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
