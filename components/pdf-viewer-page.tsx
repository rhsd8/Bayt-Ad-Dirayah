"use client"

import { useState, useEffect, useRef } from "react"
import { Dictionary } from "@/lib/dictionary"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  Eye,
  Search,
  Bookmark,
  MessageSquare,
  Highlighter,
  RotateCw,
  Share,
  Printer,
  Star,
  Clock,
  User,
  Plus,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface PDFViewerPageProps {
  lang: string
  materialId: string
  dictionary: Dictionary
}

interface Material {
  id: string
  title: string
  course: string
  type: string
  size: string
  uploadDate: string
  description: string
  pages: number
  category: string
  author: string
  language: string
  tags: string[]
}

interface Annotation {
  id: string
  page: number
  x: number
  y: number
  width: number
  height: number
  type: "highlight" | "note" | "bookmark"
  content: string
  color: string
  createdAt: string
}

export function PDFViewerPage({ lang, materialId, dictionary }: PDFViewerPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [bookmarks, setBookmarks] = useState<{ id: string; page: number; title: string; createdAt: string }[]>([])
  const [showAnnotationDialog, setShowAnnotationDialog] = useState(false)
  const [newAnnotation, setNewAnnotation] = useState("")
  const [selectedTool, setSelectedTool] = useState<"select" | "highlight" | "note">("select")
  const [readingTime, setReadingTime] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Mock material data
  const material: Material = {
    id: materialId,
    title: "Arabic Alphabet Complete Guide",
    course: "Arabic Alphabet & Pronunciation",
    type: "pdf",
    size: "3.2 MB",
    uploadDate: "2024-01-15",
    description:
      "A comprehensive guide to learning the Arabic alphabet with pronunciation examples and writing practice.",
    pages: 24,
    category: "Grammar",
    author: "Dr. Ahmed Hassan",
    language: "Arabic/English",
    tags: ["alphabet", "pronunciation", "beginner", "writing"],
  }

  // Mock annotations and bookmarks
  useEffect(() => {
    setAnnotations([
      {
        id: "1",
        page: 1,
        x: 100,
        y: 200,
        width: 200,
        height: 20,
        type: "highlight",
        content: "Important concept",
        color: "yellow",
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        page: 3,
        x: 150,
        y: 300,
        width: 0,
        height: 0,
        type: "note",
        content: "Remember to practice this daily",
        color: "blue",
        createdAt: "2024-01-15T11:00:00Z",
      },
    ])

    setBookmarks([
      { id: "1", page: 1, title: "Introduction", createdAt: "2024-01-15T10:00:00Z" },
      { id: "2", page: 5, title: "Letter Forms", createdAt: "2024-01-15T10:30:00Z" },
      { id: "3", page: 12, title: "Practice Exercises", createdAt: "2024-01-15T11:00:00Z" },
    ])
  }, [])

  // Reading time tracker
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setReadingTime((prev) => prev + 1)
    }, 1000) as NodeJS.Timeout

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = "/placeholder.pdf"
    link.download = material.title + ".pdf"
    link.click()

    toast({
      title: "Download Started",
      description: `Downloading ${material.title}...`,
    })
  }

  const handlePrint = () => {
    window.print()
    toast({
      title: "Print Dialog Opened",
      description: "Preparing document for printing...",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: material.title,
        text: material.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard",
      })
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    // Mock search results
    const results = [2, 5, 8, 12, 18]
    setSearchResults(results)
    if (results.length > 0) {
      setCurrentPage(results[0])
      toast({
        title: "Search Results",
        description: `Found ${results.length} matches`,
      })
    } else {
      toast({
        title: "No Results",
        description: "No matches found for your search",
      })
    }
  }

  const handleAddBookmark = () => {
    const newBookmark = {
      id: Date.now().toString(),
      page: currentPage,
      title: `Page ${currentPage}`,
      createdAt: new Date().toISOString(),
    }
    setBookmarks((prev) => [...prev, newBookmark])
    toast({
      title: "Bookmark Added",
      description: `Page ${currentPage} bookmarked`,
    })
  }

  const handleAddAnnotation = () => {
    if (!newAnnotation.trim()) return

    const annotation: Annotation = {
      id: Date.now().toString(),
      page: currentPage,
      x: 100,
      y: 100,
      width: selectedTool === "highlight" ? 200 : 0,
      height: selectedTool === "highlight" ? 20 : 0,
      type: selectedTool === "highlight" ? "highlight" : "note",
      content: newAnnotation,
      color: selectedTool === "highlight" ? "yellow" : "blue",
      createdAt: new Date().toISOString(),
    }

    setAnnotations((prev) => [...prev, annotation])
    setNewAnnotation("")
    setShowAnnotationDialog(false)

    toast({
      title: "Annotation Added",
      description: `${selectedTool === "highlight" ? "Highlight" : "Note"} added to page ${currentPage}`,
    })
  }

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id))
    toast({
      title: "Annotation Deleted",
      description: "Annotation removed successfully",
    })
  }

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
    toast({
      title: "Bookmark Deleted",
      description: "Bookmark removed successfully",
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "grammar":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "vocabulary":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pronunciation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const currentPageAnnotations = annotations.filter((a) => a.page === currentPage)
  // const currentPageBookmarks = bookmarks.filter((b) => b.page === currentPage)

  return (
    <AppLayout lang={lang} dictionary={dictionary}>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push(`/${lang}/materials`)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {dictionary.common.back}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{material.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{material.course}</span>
                <Badge className={getCategoryColor(material.category)}>{material.category}</Badge>
                <span>•</span>
                <User className="h-4 w-4" />
                <span>{material.author}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-yellow-500" : ""}
            >
              <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2 bg-transparent">
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" onClick={handlePrint} className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Enhanced PDF Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Viewer */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              {/* Enhanced Toolbar */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Math.max(1, Math.min(Number(e.target.value), material.pages)))}
                      className="w-16 text-center"
                      min={1}
                      max={material.pages}
                    />
                    <span className="text-sm font-medium">of {material.pages}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, material.pages))}
                      disabled={currentPage === material.pages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Tool Selection */}
                    <div className="flex items-center gap-1 border rounded-md p-1">
                      <Button
                        variant={selectedTool === "select" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedTool("select")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={selectedTool === "highlight" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedTool("highlight")}
                      >
                        <Highlighter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={selectedTool === "note" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedTool("note")}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator orientation="vertical" className="h-4" />

                    {/* Zoom Controls */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.max(zoom - 25, 50))}
                      disabled={zoom <= 50}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.min(zoom + 25, 200))}
                      disabled={zoom >= 200}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => setRotation((rotation + 90) % 360)}>
                      <RotateCw className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* PDF Content with Annotations */}
              <CardContent className="p-0">
                <div className="bg-gray-100 dark:bg-gray-800 min-h-[600px] flex items-center justify-center relative">
                  <div
                    className="bg-white shadow-lg border relative"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: "center top",
                      width: "595px",
                      height: "842px",
                    }}
                  >
                    {/* PDF Page Content */}
                    <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{material.title}</h3>
                        <p className="text-muted-foreground">
                          Page {currentPage} of {material.pages}
                        </p>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Enhanced PDF viewer with annotations, bookmarks, and search functionality.
                        </p>
                      </div>
                    </div>

                    {/* Annotations Overlay */}
                    {currentPageAnnotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className={`absolute cursor-pointer ${
                          annotation.type === "highlight"
                            ? "bg-yellow-300 bg-opacity-50"
                            : "w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                        }`}
                        style={{
                          left: annotation.x,
                          top: annotation.y,
                          width: annotation.width || 24,
                          height: annotation.height || 24,
                        }}
                        title={annotation.content}
                      >
                        {annotation.type === "note" && <MessageSquare className="h-3 w-3 text-white" />}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="bookmarks">
                  <Bookmark className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="notes">
                  <MessageSquare className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="search">
                  <Search className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Material Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Course:</span>
                        <span className="font-medium">{material.course}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Author:</span>
                        <span className="font-medium">{material.author}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Language:</span>
                        <span className="font-medium">{material.language}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">{material.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pages:</span>
                        <span className="font-medium">{material.pages}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reading Time:</span>
                        <span className="font-medium">{formatTime(readingTime)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {material.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Description</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{material.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookmarks" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Bookmarks</h3>
                  <Button size="sm" onClick={handleAddBookmark}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {bookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <button
                          onClick={() => setCurrentPage(bookmark.page)}
                          className="flex-1 text-left text-sm hover:text-foreground"
                        >
                          <div className="font-medium">{bookmark.title}</div>
                          <div className="text-xs text-muted-foreground">Page {bookmark.page}</div>
                        </button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteBookmark(bookmark.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Annotations</h3>
                  <Dialog open={showAnnotationDialog} onOpenChange={setShowAnnotationDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Annotation</DialogTitle>
                        <DialogDescription>Add a note or highlight to page {currentPage}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Type</Label>
                          <div className="flex gap-2 mt-1">
                            <Button
                              variant={selectedTool === "highlight" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTool("highlight")}
                            >
                              <Highlighter className="h-4 w-4 mr-1" />
                              Highlight
                            </Button>
                            <Button
                              variant={selectedTool === "note" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTool("note")}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Note
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="annotation">Content</Label>
                          <Textarea
                            id="annotation"
                            value={newAnnotation}
                            onChange={(e) => setNewAnnotation(e.target.value)}
                            placeholder="Enter your annotation..."
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAnnotationDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddAnnotation}>Add</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {annotations.map((annotation) => (
                      <div key={annotation.id} className="p-2 rounded-lg bg-muted/50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {annotation.type === "highlight" ? (
                                <Highlighter className="h-3 w-3 text-yellow-600" />
                              ) : (
                                <MessageSquare className="h-3 w-3 text-blue-600" />
                              )}
                              <span className="text-xs text-muted-foreground">Page {annotation.page}</span>
                            </div>
                            <p className="text-sm">{annotation.content}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAnnotation(annotation.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="search" className="space-y-4">
                <div className="space-y-2">
                  <Label>Search in document</Label>
                  <div className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search text..."
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Results ({searchResults.length})</h4>
                    <ScrollArea className="h-32">
                      <div className="space-y-1">
                        {searchResults.map((page, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(page)}
                            className="w-full text-left p-2 rounded hover:bg-muted text-sm"
                          >
                            Page {page}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Reading Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Reading Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Pages read:</span>
                  <span>
                    {currentPage}/{material.pages}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(currentPage / material.pages) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Time: {formatTime(readingTime)}</span>
                  <span>{Math.round((currentPage / material.pages) * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
