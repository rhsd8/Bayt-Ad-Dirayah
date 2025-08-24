"use client"

import { useState, useEffect } from "react"
import { Dictionary } from "@/lib/dictionary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Search, Edit, Trash2, FileText, Calendar, Star, Download, Clock } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  materialId?: string
  materialTitle?: string
  courseId?: string
  courseTitle?: string
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  color: string
}

interface NotesSystemProps {
  lang: string
  dictionary: Dictionary
}

export function NotesSystem({}: NotesSystemProps) {
  const { toast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
    category: "general",
    color: "blue",
  })

  const categories = [
    { value: "general", label: "General Notes", color: "bg-blue-100 text-blue-800" },
    { value: "grammar", label: "Grammar", color: "bg-green-100 text-green-800" },
    { value: "vocabulary", label: "Vocabulary", color: "bg-purple-100 text-purple-800" },
    { value: "pronunciation", label: "Pronunciation", color: "bg-orange-100 text-orange-800" },
    { value: "exercises", label: "Exercises", color: "bg-pink-100 text-pink-800" },
  ]

  const colors = [
    { value: "blue", class: "bg-blue-50 border-blue-200" },
    { value: "green", class: "bg-green-50 border-green-200" },
    { value: "yellow", class: "bg-yellow-50 border-yellow-200" },
    { value: "purple", class: "bg-purple-50 border-purple-200" },
    { value: "pink", class: "bg-pink-50 border-pink-200" },
  ]

  // Mock data
  useEffect(() => {
    setNotes([
      {
        id: "1",
        title: "Arabic Alphabet Overview",
        content:
          "The Arabic alphabet consists of 28 letters. Each letter has different forms depending on its position in the word: isolated, initial, medial, and final.",
        tags: ["alphabet", "basics", "forms"],
        category: "general",
        materialId: "1",
        materialTitle: "Arabic Alphabet Guide.pdf",
        courseId: "1",
        courseTitle: "Arabic Alphabet & Pronunciation",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
        isFavorite: true,
        color: "blue",
      },
      {
        id: "2",
        title: "Pronunciation Tips",
        content:
          "Remember to practice the throat sounds (ح، خ، ع، غ) daily. These are unique to Arabic and require consistent practice.",
        tags: ["pronunciation", "practice", "sounds"],
        category: "pronunciation",
        createdAt: "2024-01-14T15:30:00Z",
        updatedAt: "2024-01-14T15:30:00Z",
        isFavorite: false,
        color: "orange",
      },
      {
        id: "3",
        title: "Common Vocabulary",
        content:
          "Essential words to learn first:\n- مرحبا (Marhaba) - Hello\n- شكرا (Shukran) - Thank you\n- من فضلك (Min fadlik) - Please",
        tags: ["vocabulary", "common", "greetings"],
        category: "vocabulary",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
        isFavorite: true,
        color: "purple",
      },
    ])
  }, [])

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      })
      return
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      category: newNote.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      color: newNote.color,
    }

    setNotes((prev) => [note, ...prev])
    setNewNote({ title: "", content: "", tags: "", category: "general", color: "blue" })
    setShowCreateDialog(false)

    toast({
      title: "Success",
      description: "Note created successfully!",
    })
  }

  const handleUpdateNote = () => {
    if (!editingNote) return

    setNotes((prev) =>
      prev.map((note) => (note.id === editingNote.id ? { ...editingNote, updatedAt: new Date().toISOString() } : note)),
    )
    setEditingNote(null)

    toast({
      title: "Success",
      description: "Note updated successfully!",
    })
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    toast({
      title: "Success",
      description: "Note deleted successfully!",
    })
  }

  const handleToggleFavorite = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note)))
  }

  const handleExportNotes = () => {
    const exportData = JSON.stringify(notes, null, 2)
    const blob = new Blob([exportData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "my-notes.json"
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Notes exported successfully!",
    })
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory
    const matchesTag = selectedTag === "all" || note.tags.includes(selectedTag)

    return matchesSearch && matchesCategory && matchesTag
  })

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)))

  const getCategoryInfo = (category: string) => {
    return categories.find((cat) => cat.value === category) || categories[0]
  }

  const getColorClass = (color: string) => {
    return colors.find((c) => c.value === color)?.class || colors[0].class
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Notes</h2>
          <p className="text-muted-foreground">Organize your learning notes and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportNotes}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>Add a new note to your collection</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter note title"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your note content here..."
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newNote.category}
                      onValueChange={(value) => setNewNote((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Select
                      value={newNote.color}
                      onValueChange={(value) => setNewNote((prev) => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${color.class}`} />
                              <span className="capitalize">{color.value}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newNote.tags}
                    onChange={(e) => setNewNote((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNote}>Create Note</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    #{tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No matching notes found" : "No notes yet"}</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Create your first note to get started"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Note
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className={`hover:shadow-lg transition-shadow ${getColorClass(note.color)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getCategoryInfo(note.category).color}>
                        {getCategoryInfo(note.category).label}
                      </Badge>
                      {note.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleToggleFavorite(note.id)}>
                      <Star className={`h-4 w-4 ${note.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingNote(note)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{note.content}</p>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {note.materialTitle && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span className="truncate">{note.materialTitle}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                  {note.updatedAt !== note.createdAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Make changes to your note</DialogDescription>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingNote.category}
                    onValueChange={(value) => setEditingNote((prev) => (prev ? { ...prev, category: value } : null))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-color">Color</Label>
                  <Select
                    value={editingNote.color}
                    onValueChange={(value) => setEditingNote((prev) => (prev ? { ...prev, color: value } : null))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.class}`} />
                            <span className="capitalize">{color.value}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
                  value={editingNote.tags.join(", ")}
                  onChange={(e) =>
                    setEditingNote((prev) =>
                      prev
                        ? {
                            ...prev,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingNote(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateNote}>Update Note</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{notes.length}</div>
              <div className="text-sm text-muted-foreground">Total Notes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{notes.filter((n) => n.isFavorite).length}</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{allTags.length}</div>
              <div className="text-sm text-muted-foreground">Unique Tags</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
