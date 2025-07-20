import { ProgressPage } from "@/components/progress-page"
import { getDictionary } from "../dictionaries"

export default async function Progress({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as "en" | "ar" | "fr")

  return <ProgressPage lang={lang} dictionary={dict} />
}
