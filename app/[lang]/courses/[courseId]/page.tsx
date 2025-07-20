import { CourseDetailPage } from "@/components/course-detail-page"
import { getDictionary } from "../../dictionaries"

export default async function CourseDetail({
  params,
}: {
  params: Promise<{ lang: string; courseId: string }>
}) {
  const { lang, courseId } = await params
  const dict = await getDictionary(lang as "en" | "ar" | "fr")

  return <CourseDetailPage lang={lang} courseId={courseId} dictionary={dict} />
}
