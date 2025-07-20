import { CoursesPage } from "@/components/courses-page"
import { getDictionary } from "../dictionaries"

export default async function Courses({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as "en" | "ar" | "fr")

  return <CoursesPage lang={lang} dictionary={dict} />
}
