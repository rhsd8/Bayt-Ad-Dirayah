'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

function ThemeProviderClient({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const ThemeProvider = dynamic(() => Promise.resolve(ThemeProviderClient), {
  ssr: false,
  loading: () => <div className="contents">{}</div>
})
