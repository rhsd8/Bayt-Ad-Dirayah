import { PDFViewerPage } from "@/components/pdf-viewer-page"
import { getDictionary } from "../../dictionaries"

export default async function MaterialViewer({
  params,
}: {
  params: Promise<{ lang: string; materialId: string }>
}) {
  const { lang, materialId } = await params
  const dict = await getDictionary(lang as "en" | "ar" | "fr")

  return <PDFViewerPage lang={lang} materialId={materialId} dictionary={dict} />
}
