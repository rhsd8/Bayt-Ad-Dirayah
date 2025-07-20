import { getDictionary } from "../dictionaries"
import { LoginForm } from "@/components/login-form"

interface LoginPageProps {
  params: Promise<{ lang: string }>
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = await params

  // Validate language parameter
  const validLangs = ["en", "ar", "fr"]
  const currentLang = validLangs.includes(lang) ? lang : "en"

  let dictionary
  try {
    dictionary = await getDictionary(currentLang as "en" | "ar" | "fr")
  } catch (error) {
    console.error("Failed to load dictionary for login:", error)
    // Provide minimal fallback
    dictionary = {
      auth: {
        welcome: "Welcome",
        loginTitle: "Sign In",
        email: "Email",
        password: "Password",
        loginButton: "Sign In",
        backToHome: "Back to Home",
      },
    }
  }

  return <LoginForm lang={currentLang} dictionary={dictionary} />
}
