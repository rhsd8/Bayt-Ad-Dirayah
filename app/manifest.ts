import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Harf Project - Learn Arabic Online',
    short_name: 'Harf Project',
    description: 'Master Arabic with interactive lessons, flashcards, and personalized learning paths.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    categories: ['education', 'learning', 'language'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x800',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Harf Project Dashboard - Desktop View',
      },
      {
        src: '/screenshot-mobile.png',
        sizes: '640x1136',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Harf Project - Mobile View',
      },
    ],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Go to your learning dashboard',
        url: '/dashboard',
        icons: [{ src: '/shortcut-dashboard.png', sizes: '96x96' }],
      },
      {
        name: 'Courses',
        short_name: 'Courses',
        description: 'Browse Arabic courses',
        url: '/courses',
        icons: [{ src: '/shortcut-courses.png', sizes: '96x96' }],
      },
      {
        name: 'Flashcards',
        short_name: 'Flashcards',
        description: 'Practice with flashcards',
        url: '/flashcards',
        icons: [{ src: '/shortcut-flashcards.png', sizes: '96x96' }],
      },
    ],
  }
}