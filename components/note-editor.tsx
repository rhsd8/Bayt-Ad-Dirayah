"use client"

import { useState, useEffect } from "react"
import { Edit, Save, X, Trash2, Calendar, FolderIcon, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Note, Folder } from "@/components/notes-app"

interface NoteEditorProps {
  note: Note
  folders: Folder[]
  isEditing: boolean
  onEdit: () => void
  onSave: (note: Note) => void
  onDelete: () => void
  onCancel: () => void
  dictionary: Record<string, unknown>
}

export function NoteEditor({
  note,
  folders,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  dictionary,
}: NoteEditorProps) {
  const [editedNote, setEditedNote] = useState<Note>(note)
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    setEditedNote(note)
  }, [note])

  const handleSave = () => {
    onSave(editedNote)
  }

  const addTag = () => {
    if (newTag.trim() && !editedNote.tags.includes(newTag.trim())) {
      setEditedNote((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditedNote((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const currentFolder = folders.find((f) => f.id === note.folderId)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {dictionary.notes.updatedAt}: {new Date(note.updatedAt).toLocaleDateString()}
            </span>
            {currentFolder && (
              <>
                <FolderIcon className="h-4 w-4 ml-4" />
                <span>{currentFolder.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={onCancel}>
                  <X className="h-4 w-4 mr-2" />
                  {dictionary.common.cancel}
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {dictionary.common.save}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  {dictionary.common.edit}
                </Button>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {dictionary.common.delete}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title */}
          {isEditing ? (
            <Input
              value={editedNote.title}
              onChange={(e) => setEditedNote((prev) => ({ ...prev, title: e.target.value }))}
              placeholder={dictionary.notes.title}
              className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
            />
          ) : (
            <h1 className="text-2xl font-bold">{note.title}</h1>
          )}

          {/* Folder Selection (only in edit mode) */}
          {isEditing && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FolderIcon className="h-4 w-4" />
                  <span className="font-medium">{dictionary.notes.folder}</span>
                </div>
              </CardHeader>
              <CardContent>
                <Select
                  value={editedNote.folderId}
                  onValueChange={(value) => setEditedNote((prev) => ({ ...prev, folderId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                <span className="font-medium">{dictionary.notes.tags}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {editedNote.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    {isEditing && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    className="flex-1"
                  />
                  <Button onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content */}
          {isEditing ? (
            <Textarea
              value={editedNote.content}
              onChange={(e) => setEditedNote((prev) => ({ ...prev, content: e.target.value }))}
              placeholder={dictionary.notes.content}
              className="min-h-[400px] resize-none border-none px-0 focus-visible:ring-0"
            />
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {note.content ? (
                <pre className="whitespace-pre-wrap font-sans">{note.content}</pre>
              ) : (
                <p className="text-muted-foreground italic">{dictionary.notes.content}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
