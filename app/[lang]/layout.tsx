import type React from "react"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import { LanguageProvider } from "@/components/language-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { getDictionary } from "./dictionaries"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

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

  let dictionary
  try {
    dictionary = await getDictionary(currentLang as "en" | "ar" | "fr")
  } catch (error) {
    console.error("Failed to load dictionary:", error)
    // Fallback dictionary to prevent crashes
    dictionary = {
      common: { loading: "Loading..." },
      navigation: {},
      landing: {},
    }
  }

  return (
    <html lang={currentLang} dir={currentLang === "ar" ? "rtl" : "ltr"}>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LanguageProvider initialLang={currentLang} dictionary={dictionary}>
              <AuthProvider>{children}</AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
