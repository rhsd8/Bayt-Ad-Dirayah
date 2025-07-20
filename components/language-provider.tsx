"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

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
  dictionary?: any
}

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"]

export function LanguageProvider({ children, initialLang = "en", dictionary = {} }: LanguageProviderProps) {
  const [currentLang, setCurrentLang] = useState(initialLang)
  const [currentDictionary, setCurrentDictionary] = useState(dictionary)

  const isRTL = RTL_LANGUAGES.includes(currentLang)

  // Simple translation function
  const t = (key: string, fallback?: string): string => {
    const keys = key.split(".")
    let value = currentDictionary

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return fallback || key
      }
    }

    return typeof value === "string" ? value : fallback || key
  }

  const setLanguage = (lang: string) => {
    setCurrentLang(lang)
    // In a real app, you'd load the dictionary for the new language here
  }

  // Update document direction based on language
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = isRTL ? "rtl" : "ltr"
      document.documentElement.lang = currentLang
    }
  }, [currentLang, isRTL])

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
