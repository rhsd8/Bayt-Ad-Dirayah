import { MaterialsPage } from "@/components/materials-page"
import { getDictionary } from "../dictionaries"

export default async function Materials({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as "en" | "ar" | "fr")

  return <MaterialsPage lang={lang} dictionary={dict} />
}
