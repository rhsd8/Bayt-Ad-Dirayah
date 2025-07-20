import "server-only"

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ar: () => import("./dictionaries/ar.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
}

export const getDictionary = async (locale: keyof typeof dictionaries) => {
  try {
    const dict = await dictionaries[locale]?.()
    if (!dict) {
      console.warn(`Dictionary not found for locale: ${locale}, falling back to English`)
      return await dictionaries.en()
    }
    return dict
  } catch (error) {
    console.error(`Error loading dictionary for locale: ${locale}`, error)
    // Fallback to English dictionary
    try {
      return await dictionaries.en()
    } catch (fallbackError) {
      console.error("Error loading fallback English dictionary", fallbackError)
      // Return minimal dictionary structure to prevent crashes
      return {
        common: {
          getStarted: "Get Started",
          about: "About",
          contact: "Contact",
        },
        navigation: {
          home: "Home",
          features: "Features",
          courses: "Courses",
          materials: "Materials",
        },
        landing: {
          hero: {
            title: "Master Arabic Language",
            subtitle: "Professional Learning Platform",
            description: "Join thousands of students learning Arabic through our comprehensive interactive courses.",
            cta: "Start Learning Today",
            watchDemo: "Watch Demo",
          },
          features: {
            title: "Why Choose Our Platform?",
            subtitle: "Everything you need to master the Arabic language",
          },
          testimonials: {
            title: "What Our Students Say",
            subtitle: "Real feedback from learners around the world",
          },
          cta: {
            title: "Ready to Start Your Arabic Journey?",
            subtitle: "Join thousands of successful learners today",
            button: "Start Free Trial",
          },
          footer: {
            description: "Professional Arabic language learning platform.",
            links: {
              product: "Product",
              company: "Company",
              support: "Support",
            },
            copyright: "© 2024 Arabic Learning Platform. All rights reserved.",
          },
        },
      }
    }
  }
}
