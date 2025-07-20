export type FolderType = {
  id: string
  name: string
  color: string
}

export type Note = {
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
  folderId?: string
}

export type Folder = {
  id: string
  name: string
  color: string
}
