import type React from "react"
import { AuthProvider } from "@/components/auth-provider"
import { LanguageProvider } from "@/components/language-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { getDictionary } from "./dictionaries"
import "../globals.css"

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }, { lang: "fr" }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Validate language parameter
  const validLangs = ["en", "ar", "fr"]
  const currentLang = validLangs.includes(lang) ? lang : "en"

  const dictionary = await getDictionary(currentLang as "en" | "ar" | "fr")

  return (
    <ErrorBoundary>
      <LanguageProvider initialLang={currentLang} dictionary={dictionary}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}
