"use client"

import { createContext, useContext, useState } from "react"
import { Dictionary } from "@/app/[lang]/dictionaries"

interface LanguageContextType {
  currentLang: string
  isRTL: boolean
  t: (key: string, fallback?: string) => string
  setLanguage: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: React.ReactNode
  initialLang?: string
  dictionary?: Dictionary
}

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"]

const defaultDictionary: Partial<Dictionary> = {}

export function LanguageProvider({ children, initialLang = "en", dictionary = defaultDictionary as Dictionary }: LanguageProviderProps) {
  const [currentLang, setCurrentLang] = useState(initialLang)
  const [currentDictionary] = useState(dictionary)

  const isRTL = RTL_LANGUAGES.includes(currentLang)

  // Simple translation function
  const t = (key: string, fallback?: string): string => {
    const keys = key.split(".")
    let current = currentDictionary as Record<string, any>

    try {
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k]
        } else {
          return fallback || key
        }
      }

      return typeof current === "string" ? current : fallback || key
    } catch {
      return fallback || key
    }
  }

  const setLanguage = (lang: string) => {
    setCurrentLang(lang)
    // In a real app, you'd load the dictionary for the new language here
  }

  // Note: Document direction and language are handled in the layout

  const value = {
    currentLang,
    isRTL,
    t,
    setLanguage,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
