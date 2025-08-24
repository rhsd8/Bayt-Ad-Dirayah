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

  const dictionary = await getDictionary(currentLang as "en" | "ar" | "fr")

  return <LoginForm lang={currentLang} dictionary={dictionary} />
}
