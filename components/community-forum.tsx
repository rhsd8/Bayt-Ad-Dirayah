"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { AppLayout } from "@/components/app-layout"
import {
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  Reply,
  Pin,
  Lock,
  Users,
  TrendingUp,
  Clock,
  Star,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Eye,
  MessageCircle,
  Filter,
  SortAsc,
  Award,
  Globe,
  Volume2,
  Share,
  Bookmark,
} from "lucide-react"

// Types
interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    role: "student" | "teacher" | "admin"
    level: string
    reputation: number
    joinedAt: string
  }
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  dislikes: number
  replies: number
  views: number
  isPinned: boolean
  isLocked: boolean
  isSolved: boolean
  isBookmarked: boolean
  lastReply?: {
    author: string
    timestamp: string
  }
  status: "active" | "closed" | "archived"
}

interface ForumReply {
  id: string
  postId: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    role: "student" | "teacher" | "admin"
    level: string
    reputation: number
  }
  createdAt: string
  likes: number
  dislikes: number
  isAccepted: boolean
  parentReplyId?: string
}

interface ForumCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  postCount: number
  isModerated: boolean
}

interface CommunityStats {
  totalPosts: number
  totalMembers: number
  solvedPosts: number
  responseRate: number
  activeToday: number
}

interface CommunityForumProps {
  lang: string
  dictionary: Record<string, unknown>
}

// Custom hooks
const useForumData = () => {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockPosts: ForumPost[] = [
          {
            id: "1",
            title: "How to properly pronounce the letter ع (Ain)?",
            content:
              "I'm having trouble with the pronunciation of the Arabic letter ع. Can someone explain the proper technique and maybe share some practice tips? I've been trying for weeks but still can't get it right.",
            author: {
              id: "1",
              name: "Sarah Johnson",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "student",
              level: "Beginner",
              reputation: 45,
              joinedAt: "2023-09-15",
            },
            category: "pronunciation",
            tags: ["pronunciation", "letters", "beginner", "help"],
            createdAt: "2024-01-16T10:30:00Z",
            updatedAt: "2024-01-16T14:20:00Z",
            likes: 12,
            dislikes: 0,
            replies: 8,
            views: 45,
            isPinned: false,
            isLocked: false,
            isSolved: true,
            isBookmarked: false,
            lastReply: {
              author: "Dr. Ahmed Hassan",
              timestamp: "2024-01-16T14:20:00Z",
            },
            status: "active",
          },
          {
            id: "2",
            title: "Best resources for learning Arabic grammar?",
            content:
              "I'm looking for comprehensive resources to learn Arabic grammar. What books, websites, or apps would you recommend for intermediate learners? I've completed the basics and want to move to more advanced topics.",
            author: {
              id: "2",
              name: "Mike Chen",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "student",
              level: "Intermediate",
              reputation: 78,
              joinedAt: "2023-08-20",
            },
            category: "grammar",
            tags: ["grammar", "resources", "intermediate", "books"],
            createdAt: "2024-01-15T16:45:00Z",
            updatedAt: "2024-01-16T09:15:00Z",
            likes: 18,
            dislikes: 1,
            replies: 12,
            views: 67,
            isPinned: true,
            isLocked: false,
            isSolved: false,
            isBookmarked: true,
            lastReply: {
              author: "Prof. Fatima Al-Zahra",
              timestamp: "2024-01-16T09:15:00Z",
            },
            status: "active",
          },
          {
            id: "3",
            title: "Common mistakes in Arabic writing - Discussion",
            content:
              "Let's discuss the most common mistakes beginners make when writing in Arabic and how to avoid them. I'll start with a few I've noticed in my teaching experience.",
            author: {
              id: "3",
              name: "Dr. Ahmed Hassan",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "teacher",
              level: "Expert",
              reputation: 234,
              joinedAt: "2022-03-10",
            },
            category: "general",
            tags: ["writing", "mistakes", "tips", "discussion"],
            createdAt: "2024-01-14T12:00:00Z",
            updatedAt: "2024-01-15T18:30:00Z",
            likes: 25,
            dislikes: 2,
            replies: 15,
            views: 123,
            isPinned: true,
            isLocked: false,
            isSolved: false,
            isBookmarked: false,
            lastReply: {
              author: "Omar Khalil",
              timestamp: "2024-01-15T18:30:00Z",
            },
            status: "active",
          },
        ]

        const mockReplies: ForumReply[] = [
          {
            id: "1",
            postId: "1",
            content:
              "The letter ع is produced by constricting the pharynx. Try placing your hand on your throat and feel the vibration when you say 'ah' but with a tighter throat. Practice with words like عين (eye) and عرب (Arab). It takes time, so be patient with yourself!",
            author: {
              id: "3",
              name: "Dr. Ahmed Hassan",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "teacher",
              level: "Expert",
              reputation: 234,
            },
            createdAt: "2024-01-16T11:15:00Z",
            likes: 8,
            dislikes: 0,
            isAccepted: true,
          },
          {
            id: "2",
            postId: "1",
            content:
              "I found it helpful to listen to native speakers and repeat after them. YouTube has great pronunciation videos! Also, try the Forvo pronunciation dictionary.",
            author: {
              id: "5",
              name: "Alex Rodriguez",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "student",
              level: "Intermediate",
              reputation: 56,
            },
            createdAt: "2024-01-16T12:30:00Z",
            likes: 3,
            dislikes: 0,
            isAccepted: false,
          },
        ]

        setPosts(mockPosts)
        setReplies(mockReplies)
      } catch {
        setError("Failed to load forum data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { posts, replies, loading, error, setPosts, setReplies }
}

// Utility functions
const getRoleColor = (role: string): string => {
  const colors = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    teacher: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    student: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }
  return colors[role as keyof typeof colors] || colors.student
}

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  const days = Math.floor(diffInHours / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return time.toLocaleDateString()
}

const calculateStats = (posts: ForumPost[]): CommunityStats => {
  const solvedPosts = posts.filter((post) => post.isSolved).length
  const postsWithReplies = posts.filter((post) => post.replies > 0).length

  return {
    totalPosts: posts.length,
    totalMembers: 247, // Mock data
    solvedPosts,
    responseRate: posts.length > 0 ? Math.round((postsWithReplies / posts.length) * 100) : 0,
    activeToday: 23, // Mock data
  }
}

// Forum categories configuration
const forumCategories: ForumCategory[] = [
  {
    id: "general",
    name: "General Discussion",
    description: "General Arabic learning discussions",
    icon: MessageSquare,
    color: "blue",
    postCount: 45,
    isModerated: false,
  },
  {
    id: "grammar",
    name: "Grammar Help",
    description: "Questions about Arabic grammar",
    icon: BookOpen,
    color: "green",
    postCount: 32,
    isModerated: true,
  },
  {
    id: "vocabulary",
    name: "Vocabulary",
    description: "Word meanings and usage",
    icon: Lightbulb,
    color: "yellow",
    postCount: 28,
    isModerated: false,
  },
  {
    id: "pronunciation",
    name: "Pronunciation",
    description: "Help with Arabic pronunciation",
    icon: Volume2,
    color: "purple",
    postCount: 19,
    isModerated: true,
  },
  {
    id: "culture",
    name: "Culture & Customs",
    description: "Arabic culture and traditions",
    icon: Globe,
    color: "pink",
    postCount: 15,
    isModerated: false,
  },
  {
    id: "resources",
    name: "Learning Resources",
    description: "Share and discover learning materials",
    icon: Star,
    color: "indigo",
    postCount: 22,
    isModerated: false,
  },
  {
    id: "questions",
    name: "Q&A",
    description: "Quick questions and answers",
    icon: HelpCircle,
    color: "orange",
    postCount: 38,
    isModerated: false,
  },
  {
    id: "announcements",
    name: "Announcements",
    description: "Important updates and news",
    icon: AlertCircle,
    color: "red",
    postCount: 8,
    isModerated: true,
  },
]

// Components
const CommunityStats = ({ stats }: { stats: CommunityStats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          <div>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <div className="text-sm text-muted-foreground">Members</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-purple-600" />
          <div>
            <div className="text-2xl font-bold">{stats.solvedPosts}</div>
            <div className="text-sm text-muted-foreground">Solved</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          <div>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <div className="text-sm text-muted-foreground">Response Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

const CategoryGrid = ({
  categories,
  posts,
  onCategorySelect,
}: {
  categories: ForumCategory[]
  posts: ForumPost[]
  onCategorySelect: (categoryId: string) => void
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Categories</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon
          const categoryPosts = posts.filter((post) => post.category === category.id)

          return (
            <div
              key={category.id}
              className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors group"
              onClick={() => onCategorySelect(category.id)}
            >
              <div className={`p-2 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900/20`}>
                <Icon className={`h-5 w-5 text-${category.color}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm group-hover:text-foreground transition-colors">{category.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 mb-1">{category.description}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{categoryPosts.length} posts</span>
                  {category.isModerated && (
                    <Badge variant="outline" className="text-xs">
                      Moderated
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </CardContent>
  </Card>
)

const PostCard = ({
  post,
  onViewPost,
  onLikePost,
  onBookmarkPost,
}: {
  post: ForumPost
  onViewPost: (post: ForumPost) => void
  onLikePost: (postId: string) => void
  onBookmarkPost: (postId: string) => void
}) => {
  const category = forumCategories.find((cat) => cat.id === post.category)
  const CategoryIcon = category?.icon || MessageSquare

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1" onClick={() => onViewPost(post)}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium">{post.author.name}</span>
                  <Badge className={getRoleColor(post.author.role)} variant="secondary">
                    {post.author.role}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {post.author.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Award className="h-3 w-3" />
                    {post.author.reputation}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CategoryIcon className="h-4 w-4" />
                  <span>{category?.name}</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {post.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
              {post.isLocked && <Lock className="h-4 w-4 text-red-600" />}
              {post.isSolved && <CheckCircle className="h-4 w-4 text-green-600" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onBookmarkPost(post.id)
                }}
                className={post.isBookmarked ? "text-yellow-600" : ""}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2" onClick={() => onViewPost(post)}>
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-foreground transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground line-clamp-3 text-sm">{post.content}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1" onClick={() => onViewPost(post)}>
            {post.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 4} more
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.replies}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onLikePost(post.id)
                }}
                className="gap-1 h-auto p-1"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
            </div>
            {post.lastReply && (
              <div className="text-sm text-muted-foreground">
                Last reply by {post.lastReply.author} • {formatTimeAgo(post.lastReply.timestamp)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CreatePostDialog = ({
  open,
  onOpenChange,
  onCreatePost,
  categories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreatePost: (post: Partial<ForumPost>) => void
  categories: ForumCategory[]
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    tags: "",
  })

  const handleSubmit = useCallback(() => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return
    }

    const newPost: Partial<ForumPost> = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: 0,
      views: 0,
      isPinned: false,
      isLocked: false,
      isSolved: false,
      isBookmarked: false,
      status: "active",
    }

    onCreatePost(newPost)
    setFormData({
      title: "",
      content: "",
      category: "general",
      tags: "",
    })
    onOpenChange(false)
  }, [formData, onCreatePost, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>Share your question or start a discussion with the community</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="post-title">Title *</Label>
            <Input
              id="post-title"
              placeholder="Enter a clear, descriptive title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="post-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="post-tags">Tags</Label>
              <Input
                id="post-tags"
                placeholder="grammar, beginner, help"
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="post-content">Content *</Label>
            <Textarea
              id="post-content"
              placeholder="Describe your question or topic in detail. The more context you provide, the better help you'll receive."
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title.trim() || !formData.content.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main component
export function CommunityForum({ lang, dictionary }: CommunityForumProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"created" | "updated" | "likes" | "replies">("updated")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null)
  const [showPostDialog, setShowPostDialog] = useState(false)

  const { posts, replies, loading, error, setPosts } = useForumData()
  const stats = useMemo(() => calculateStats(posts), [posts])

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pinned" && post.isPinned) ||
        (activeTab === "solved" && post.isSolved) ||
        (activeTab === "unanswered" && post.replies === 0)

      return matchesSearch && matchesCategory && matchesTab && post.status === "active"
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "likes":
          return b.likes - a.likes
        case "replies":
          return b.replies - a.replies
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "created":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [posts, searchQuery, selectedCategory, activeTab, sortBy])

  const handleCreatePost = useCallback(
    (newPostData: Partial<ForumPost>) => {
      const post: ForumPost = {
        id: Date.now().toString(),
        title: newPostData.title || "",
        content: newPostData.content || "",
        author: {
          id: user?.id || "current-user",
          name: user?.name || "Current User",
          role: user?.role || "student",
          level: "Beginner",
          reputation: 0,
          joinedAt: new Date().toISOString(),
        },
        category: newPostData.category || "general",
        tags: newPostData.tags || [],
        createdAt: newPostData.createdAt || new Date().toISOString(),
        updatedAt: newPostData.createdAt || new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: 0,
        views: 0,
        isPinned: false,
        isLocked: false,
        isSolved: false,
        isBookmarked: false,
        status: "active",
      }

      setPosts((prev) => [post, ...prev])
      toast({
        title: "Post Created Successfully",
        description: "Your post has been published to the community",
      })
    },
    [user, setPosts, toast],
  )

  const handleLikePost = useCallback(
    (postId: string) => {
      setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
    },
    [setPosts],
  )

  const handleBookmarkPost = useCallback(
    (postId: string) => {
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post)),
      )
    },
    [setPosts],
  )

  const handleViewPost = useCallback(
    (post: ForumPost) => {
      // Increment view count
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p)))
      setSelectedPost(post)
      setShowPostDialog(true)
    },
    [setPosts],
  )

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setActiveTab("all")
  }, [])

  if (loading) {
    return (
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading community forum...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout lang={lang} dictionary={dictionary}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Forum</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout lang={lang} dictionary={dictionary}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Community Forum
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Connect with fellow learners, ask questions, and share knowledge
              </p>
            </div>

            <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>

          <CommunityStats stats={stats} />
        </div>

        {/* Categories */}
        <CategoryGrid categories={forumCategories} posts={posts} onCategorySelect={handleCategorySelect} />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts, topics, or users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {forumCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value: "created" | "updated" | "likes" | "replies") => setSortBy(value)}>
                    <SelectTrigger className="w-48">
                      <SortAsc className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Recently Updated</SelectItem>
                      <SelectItem value="created">Newest First</SelectItem>
                      <SelectItem value="likes">Most Liked</SelectItem>
                      <SelectItem value="replies">Most Replies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                All Posts
              </TabsTrigger>
              <TabsTrigger value="pinned" className="gap-2">
                <Pin className="h-4 w-4" />
                Pinned
              </TabsTrigger>
              <TabsTrigger value="solved" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Solved
              </TabsTrigger>
              <TabsTrigger value="unanswered" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Unanswered
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredAndSortedPosts.length === 0 ? (
                <Card className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Posts Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategory !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Be the first to start a discussion!"}
                  </p>
                  <div className="flex gap-2 justify-center">
                    {(searchQuery || selectedCategory !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button onClick={() => setShowCreateDialog(true)}>Create Post</Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onViewPost={handleViewPost}
                      onLikePost={handleLikePost}
                      onBookmarkPost={handleBookmarkPost}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <CreatePostDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreatePost={handleCreatePost}
          categories={forumCategories}
        />

        {/* Post Detail Dialog */}
        <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPost && (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <DialogTitle className="text-xl">{selectedPost.title}</DialogTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedPost.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{selectedPost.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{selectedPost.author.name}</span>
                        <Badge className={getRoleColor(selectedPost.author.role)} variant="secondary">
                          {selectedPost.author.role}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{formatTimeAgo(selectedPost.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPost.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                      {selectedPost.isLocked && <Lock className="h-4 w-4 text-red-600" />}
                      {selectedPost.isSolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {selectedPost.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {selectedPost.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Reply className="h-4 w-4" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Share className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{selectedPost.views} views</span>
                    </div>
                  </div>
                </div>

                {/* Replies section would go here */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Replies ({selectedPost.replies})</h3>
                  {replies
                    .filter((reply) => reply.postId === selectedPost.id)
                    .map((reply) => (
                      <Card key={reply.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{reply.author.name}</span>
                                <Badge className={getRoleColor(reply.author.role)} variant="secondary">
                                  {reply.author.role}
                                </Badge>
                                {reply.isAccepted && (
                                  <Badge variant="outline" className="gap-1 text-green-600">
                                    <CheckCircle className="h-3 w-3" />
                                    Accepted
                                  </Badge>
                                )}
                                <span className="text-sm text-muted-foreground">{formatTimeAgo(reply.createdAt)}</span>
                              </div>
                              <p className="text-muted-foreground mb-2 whitespace-pre-wrap">{reply.content}</p>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="gap-1 h-auto p-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {reply.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-1 h-auto p-1">
                                  <Reply className="h-3 w-3" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
