import { getDictionary } from "../dictionaries"
import { CommunityForum } from "@/components/community-forum"

interface CommunityPageProps {
  params: Promise<{ lang: string }>
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { lang } = await params
  const dictionary = await getDictionary(lang as "en" | "ar" | "fr")

  return <CommunityForum lang={lang} dictionary={dictionary} />
}
