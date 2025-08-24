"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Download, Eye, Calendar, Filter, SortAsc, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

interface Material {
  id: string
  title: string
  course: string
  type: "pdf" | "video" | "audio"
  size: string
  uploadDate: string
  downloads: number
  category: string
}

interface MaterialsPageProps {
  lang: string
  dictionary: Record<string, unknown>
}

export function MaterialsPage({ lang, dictionary }: MaterialsPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterBy, setFilterBy] = useState("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadCourse, setUploadCourse] = useState("")

  // Mock materials data
  const materials: Material[] = [
    {
      id: "1",
      title: "Arabic Alphabet Complete Guide",
      course: "Arabic Alphabet & Pronunciation",
      type: "pdf",
      size: "3.2 MB",
      uploadDate: "2024-01-15",
      downloads: 245,
      category: "Grammar",
    },
    {
      id: "2",
      title: "Pronunciation Practice Audio",
      course: "Arabic Alphabet & Pronunciation",
      type: "audio",
      size: "15.8 MB",
      uploadDate: "2024-01-14",
      downloads: 189,
      category: "Pronunciation",
    },
    {
      id: "3",
      title: "Basic Grammar Rules",
      course: "Basic Grammar & Sentence Structure",
      type: "pdf",
      size: "2.7 MB",
      uploadDate: "2024-01-12",
      downloads: 156,
      category: "Grammar",
    },
    {
      id: "4",
      title: "Vocabulary Building Exercises",
      course: "Intermediate Vocabulary Building",
      type: "pdf",
      size: "4.1 MB",
      uploadDate: "2024-01-10",
      downloads: 134,
      category: "Vocabulary",
    },
    {
      id: "5",
      title: "Reading Comprehension Texts",
      course: "Advanced Reading Comprehension",
      type: "pdf",
      size: "5.3 MB",
      uploadDate: "2024-01-08",
      downloads: 98,
      category: "Reading",
    },
    {
      id: "6",
      title: "Calligraphy Practice Sheets",
      course: "Arabic Calligraphy Basics",
      type: "pdf",
      size: "6.2 MB",
      uploadDate: "2024-01-05",
      downloads: 87,
      category: "Writing",
    },
  ]

  const courses = [
    "Arabic Alphabet & Pronunciation",
    "Basic Grammar & Sentence Structure",
    "Intermediate Vocabulary Building",
    "Advanced Reading Comprehension",
    "Arabic Calligraphy Basics",
  ]

  const filteredMaterials = materials
    .filter((material) => {
      const matchesSearch =
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.course.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterBy === "all" || material.category.toLowerCase() === filterBy.toLowerCase()
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        case "name":
          return a.title.localeCompare(b.title)
        case "downloads":
          return b.downloads - a.downloads
        case "size":
          return Number.parseFloat(b.size) - Number.parseFloat(a.size)
        default:
          return 0
      }
    })

  const handleViewMaterial = (materialId: string) => {
    router.push(`/${lang}/materials/${materialId}`)
  }

  const handleDownloadMaterial = (material: Material) => {
    // Simulate download
    const link = document.createElement("a")
    link.href = "/placeholder.pdf"
    link.download = material.title + ".pdf"
    link.click()

    toast({
      title: "Download Started",
      description: `Downloading ${material.title}...`,
    })
  }

  const handleUploadMaterial = () => {
    if (!uploadFile || !uploadCourse) {
      toast({
        title: "Error",
        description: "Please select a file and course",
        variant: "destructive",
      })
      return
    }

    // Simulate upload
    toast({
      title: "Success",
      description: dictionary.materials.uploadSuccess,
    })
    setShowUploadDialog(false)
    setUploadFile(null)
    setUploadCourse("")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />
      case "video":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "audio":
        return <FileText className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "grammar":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "vocabulary":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pronunciation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "reading":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "writing":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <AppLayout lang={lang} dictionary={dictionary}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{dictionary.materials.title}</h1>
              <p className="text-muted-foreground text-lg mt-2">Access and download course materials and resources</p>
            </div>

            {user?.role === "admin" && (
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    {dictionary.materials.uploadMaterial}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{dictionary.materials.uploadMaterial}</DialogTitle>
                    <DialogDescription>Upload a new material to a course</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Select value={uploadCourse} onValueChange={setUploadCourse}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.mp3,.mp4"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                        {dictionary.common.cancel}
                      </Button>
                      <Button onClick={handleUploadMaterial}>{dictionary.common.upload}</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={dictionary.materials.searchMaterials}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterBy("all")}>All Categories</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("grammar")}>Grammar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("vocabulary")}>Vocabulary</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("pronunciation")}>Pronunciation</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("reading")}>Reading</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("writing")}>Writing</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <SortAsc className="h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("date")}>Upload Date</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("downloads")}>Downloads</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("size")}>File Size</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? dictionary.common.noResults : dictionary.materials.noMaterials}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "Materials will be added soon"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      {getTypeIcon(material.type)}
                      <div className="min-w-0">
                        <CardTitle className="text-lg leading-tight line-clamp-2">{material.title}</CardTitle>
                        <CardDescription className="line-clamp-1">{material.course}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(material.category)}>{material.category}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Material Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Size:</span>
                      <p>{material.size}</p>
                    </div>
                    <div>
                      <span className="font-medium">Downloads:</span>
                      <p>{material.downloads}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Uploaded {formatDate(material.uploadDate)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewMaterial(material.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {dictionary.materials.viewPDF}
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleDownloadMaterial(material)}>
                      <Download className="h-4 w-4 mr-2" />
                      {dictionary.materials.downloadPDF}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{materials.length}</div>
                <div className="text-sm text-muted-foreground">Total Materials</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{materials.reduce((acc, m) => acc + m.downloads, 0)}</div>
                <div className="text-sm text-muted-foreground">Total Downloads</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{materials.filter((m) => m.type === "pdf").length}</div>
                <div className="text-sm text-muted-foreground">PDF Files</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {materials.reduce((acc, m) => acc + Number.parseFloat(m.size), 0).toFixed(1)} MB
                </div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
