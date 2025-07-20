import { AdminDashboard } from "@/components/admin-dashboard"
import { getDictionary } from "../dictionaries"

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as "en" | "ar" | "fr")

  return <AdminDashboard lang={lang} dictionary={dict} />
}
