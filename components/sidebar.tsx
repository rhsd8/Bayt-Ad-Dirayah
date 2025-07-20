"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import {
  Home,
  BookOpen,
  FileText,
  Users,
  Settings,
  Brain,
  MessageSquare,
  Trophy,
  BarChart3,
  User,
  ChevronRight,
  GraduationCap,
  Library,
  Zap,
  Target,
  Calendar,
  HelpCircle,
  Globe,
  Volume2,
  PenTool,
  Award,
  Bookmark,
  Clock,
  TrendingUp,
  Shield,
  UserPlus,
  Database,
  Bell,
  Mail,
  CheckCircle,
  Info,
  Lightbulb,
  Headphones,
  Video,
  File,
  Folder,
  Flame,
  Activity,
  Sparkles,
} from "lucide-react"

interface SidebarProps {
  lang: string
  dictionary: any
}

interface NavigationItem {
  title: string
  icon: any
  href?: string
  badge?: string | number
  items?: NavigationItem[]
  isActive?: boolean
  isNew?: boolean
  isComingSoon?: boolean
  color?: string
}

export function AppSidebar({ lang, dictionary }: SidebarProps) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  // Auto-expand groups containing active items
  useEffect(() => {
    const activeGroups: string[] = []

    // Check which groups contain the current path
    if (pathname.includes("/courses")) activeGroups.push("learning")
    if (pathname.includes("/quiz") || pathname.includes("/flashcards")) activeGroups.push("tools")
    if (pathname.includes("/materials")) activeGroups.push("materials")
    if (pathname.includes("/notes") || pathname.includes("/study")) activeGroups.push("study")
    if (pathname.includes("/community")) activeGroups.push("community")
    if (pathname.includes("/achievements") || pathname.includes("/stats")) activeGroups.push("progress")
    if (pathname.includes("/admin")) activeGroups.push("admin")
    if (pathname.includes("/settings") || pathname.includes("/help")) activeGroups.push("support")

    setExpandedGroups(activeGroups)
  }, [pathname])

  // Enhanced navigation structure
  const navigation: NavigationItem[] = [
    {
      title: t("nav.dashboard", "Dashboard"),
      icon: Home,
      href: `/${lang}/dashboard`,
      isActive: pathname === `/${lang}/dashboard`,
      color: "text-blue-600",
    },
  ]

  const learningNavigation: NavigationItem[] = [
    {
      title: t("nav.courses", "Learning"),
      icon: BookOpen,
      items: [
        {
          title: "Browse Courses",
          icon: Library,
          href: `/${lang}/courses`,
          isActive: pathname === `/${lang}/courses`,
          badge: "12 Available",
        },
        {
          title: "My Progress",
          icon: TrendingUp,
          href: `/${lang}/progress`,
          isActive: pathname.startsWith(`/${lang}/progress`),
          badge: "75%",
          color: "text-green-600",
        },
        {
          title: "Certificates",
          icon: Award,
          href: `/${lang}/certificates`,
          isActive: pathname === `/${lang}/certificates`,
          badge: 3,
          color: "text-yellow-600",
        },
        {
          title: "Bookmarks",
          icon: Bookmark,
          href: `/${lang}/bookmarks`,
          isActive: pathname === `/${lang}/bookmarks`,
          badge: 12,
        },
      ],
    },
  ]

  const toolsNavigation: NavigationItem[] = [
    {
      title: t("nav.learning_tools", "Learning Tools"),
      icon: Brain,
      items: [
        {
          title: "Quiz Center",
          icon: Target,
          href: `/${lang}/quiz`,
          isActive: pathname.startsWith(`/${lang}/quiz`),
          badge: "New",
          isNew: true,
          color: "text-purple-600",
        },
        {
          title: "Flashcards",
          icon: Zap,
          href: `/${lang}/flashcards`,
          isActive: pathname === `/${lang}/flashcards`,
          badge: 45,
          color: "text-yellow-600",
        },
        {
          title: "Practice Tests",
          icon: CheckCircle,
          href: `/${lang}/practice`,
          isActive: pathname === `/${lang}/practice`,
          badge: 8,
          color: "text-green-600",
        },
        {
          title: "Pronunciation",
          icon: Volume2,
          href: `/${lang}/pronunciation`,
          isActive: pathname === `/${lang}/pronunciation`,
          isNew: true,
          color: "text-blue-600",
        },
        {
          title: "Writing Practice",
          icon: PenTool,
          href: `/${lang}/writing`,
          isActive: pathname === `/${lang}/writing`,
          color: "text-indigo-600",
        },
      ],
    },
  ]

  const materialsNavigation: NavigationItem[] = [
    {
      title: t("nav.materials", "Resources"),
      icon: Library,
      items: [
        {
          title: "Study Materials",
          icon: File,
          href: `/${lang}/materials`,
          isActive: pathname.startsWith(`/${lang}/materials`),
          badge: 156,
        },
        {
          title: "Video Library",
          icon: Video,
          href: `/${lang}/videos`,
          isActive: pathname === `/${lang}/videos`,
          badge: 89,
          color: "text-red-600",
        },
        {
          title: "Audio Lessons",
          icon: Headphones,
          href: `/${lang}/audio`,
          isActive: pathname === `/${lang}/audio`,
          badge: 67,
          color: "text-green-600",
        },
        {
          title: "Downloads",
          icon: Folder,
          href: `/${lang}/downloads`,
          isActive: pathname === `/${lang}/downloads`,
          badge: 23,
        },
      ],
    },
  ]

  const studyNavigation: NavigationItem[] = [
    {
      title: t("nav.study", "Study Tools"),
      icon: FileText,
      items: [
        {
          title: "My Notes",
          icon: FileText,
          href: `/${lang}/notes`,
          isActive: pathname === `/${lang}/notes`,
          badge: 34,
          color: "text-blue-600",
        },
        {
          title: "Study Plans",
          icon: Calendar,
          href: `/${lang}/study-plans`,
          isActive: pathname === `/${lang}/study-plans`,
          badge: 3,
          color: "text-purple-600",
        },
        {
          title: "Reminders",
          icon: Bell,
          href: `/${lang}/reminders`,
          isActive: pathname === `/${lang}/reminders`,
          badge: 5,
          color: "text-orange-600",
        },
        {
          title: "Study Timer",
          icon: Clock,
          href: `/${lang}/timer`,
          isActive: pathname === `/${lang}/timer`,
          isNew: true,
          color: "text-green-600",
        },
      ],
    },
  ]

  const communityNavigation: NavigationItem[] = [
    {
      title: t("nav.community", "Community"),
      icon: Users,
      items: [
        {
          title: "Discussion Forum",
          icon: MessageSquare,
          href: `/${lang}/community`,
          isActive: pathname.startsWith(`/${lang}/community`),
          badge: 12,
          color: "text-green-600",
        },
        {
          title: "Study Groups",
          icon: UserPlus,
          href: `/${lang}/groups`,
          isActive: pathname === `/${lang}/groups`,
          badge: 5,
          color: "text-blue-600",
        },
        {
          title: "Language Exchange",
          icon: Globe,
          href: `/${lang}/exchange`,
          isActive: pathname === `/${lang}/exchange`,
          isNew: true,
          color: "text-purple-600",
        },
        {
          title: "Leaderboard",
          icon: Trophy,
          href: `/${lang}/leaderboard`,
          isActive: pathname === `/${lang}/leaderboard`,
          color: "text-yellow-600",
        },
      ],
    },
  ]

  const progressNavigation: NavigationItem[] = [
    {
      title: t("nav.progress", "Progress & Stats"),
      icon: BarChart3,
      items: [
        {
          title: "Learning Analytics",
          icon: Activity,
          href: `/${lang}/analytics`,
          isActive: pathname === `/${lang}/analytics`,
          color: "text-blue-600",
        },
        {
          title: "Achievements",
          icon: Trophy,
          href: `/${lang}/achievements`,
          isActive: pathname === `/${lang}/achievements`,
          badge: 15,
          color: "text-yellow-600",
        },
        {
          title: "Streak Tracker",
          icon: Flame,
          href: `/${lang}/streak`,
          isActive: pathname === `/${lang}/streak`,
          badge: "7 days",
          color: "text-orange-600",
        },
        {
          title: "Goals",
          icon: Target,
          href: `/${lang}/goals`,
          isActive: pathname === `/${lang}/goals`,
          badge: 3,
          color: "text-green-600",
        },
      ],
    },
  ]

  const adminNavigation: NavigationItem[] =
    user?.role === "admin"
      ? [
          {
            title: t("nav.admin", "Administration"),
            icon: Shield,
            items: [
              {
                title: "Admin Dashboard",
                icon: BarChart3,
                href: `/${lang}/admin`,
                isActive: pathname === `/${lang}/admin`,
                color: "text-red-600",
              },
              {
                title: "User Management",
                icon: Users,
                href: `/${lang}/admin/users`,
                isActive: pathname === `/${lang}/admin/users`,
                color: "text-blue-600",
              },
              {
                title: "Content Management",
                icon: Database,
                href: `/${lang}/admin/content`,
                isActive: pathname === `/${lang}/admin/content`,
                color: "text-green-600",
              },
              {
                title: "System Settings",
                icon: Settings,
                href: `/${lang}/admin/settings`,
                isActive: pathname === `/${lang}/admin/settings`,
                color: "text-purple-600",
              },
            ],
          },
        ]
      : []

  const supportNavigation: NavigationItem[] = [
    {
      title: t("nav.support", "Help & Support"),
      icon: HelpCircle,
      items: [
        {
          title: "Settings",
          icon: Settings,
          href: `/${lang}/settings`,
          isActive: pathname === `/${lang}/settings`,
        },
        {
          title: "Help Center",
          icon: Info,
          href: `/${lang}/help`,
          isActive: pathname === `/${lang}/help`,
          color: "text-blue-600",
        },
        {
          title: "Tutorials",
          icon: Lightbulb,
          href: `/${lang}/tutorials`,
          isActive: pathname === `/${lang}/tutorials`,
          badge: "New",
          isNew: true,
          color: "text-yellow-600",
        },
        {
          title: "Contact Support",
          icon: Mail,
          href: `/${lang}/contact`,
          isActive: pathname === `/${lang}/contact`,
          color: "text-green-600",
        },
      ],
    },
  ]

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const renderNavigationGroup = (items: NavigationItem[], groupId: string, groupLabel: string) => {
    const isExpanded = expandedGroups.includes(groupId)

    return (
      <SidebarGroup key={groupId}>
        <Collapsible open={isExpanded} onOpenChange={() => toggleGroup(groupId)}>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="group/collapsible w-full flex items-center justify-between hover:bg-muted/50 rounded-md p-2 transition-colors">
              <span className="text-sm font-medium">{groupLabel}</span>
              <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {items[0]?.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive} className="group relative">
                      <Link
                        href={item.href || "#"}
                        className="flex items-center w-full px-2 py-1.5 rounded-lg transition-colors 
                          hover:bg-muted group justify-between"
                      >
                        {/* Icon + Text (Left side) */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              "p-2 rounded-md transition-colors shrink-0 flex items-center justify-center",
                              item.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:bg-accent"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                          </div>
                          <span className="truncate font-semibold text-base text-primary">{item.title}</span>
                        </div>

                        {/* New item indicator (Right side) */}
                        {item.isNew && (
                          <div className="ml-3 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
    )
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg truncate">Arabic Learning</h2>
            <p className="text-xs text-muted-foreground truncate">Master Arabic Language</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.href || "#"} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-1.5 rounded-md transition-colors",
                          item.isActive ? "bg-primary/10 text-primary" : "bg-muted/50 hover:bg-muted",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4",
                            item.color || (item.isActive ? "text-primary" : "text-muted-foreground"),
                          )}
                        />
                      </div>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {/* Learning Section */}
          {renderNavigationGroup(learningNavigation, "learning", "Learning")}

          {/* Tools Section */}
          {renderNavigationGroup(toolsNavigation, "tools", "Learning Tools")}

          {/* Materials Section */}
          {renderNavigationGroup(materialsNavigation, "materials", "Resources")}

          {/* Study Section */}
          {renderNavigationGroup(studyNavigation, "study", "Study Tools")}

          {/* Community Section */}
          {renderNavigationGroup(communityNavigation, "community", "Community")}

          {/* Progress Section */}
          {renderNavigationGroup(progressNavigation, "progress", "Progress & Stats")}

          {/* Admin Section */}
          {adminNavigation.length > 0 && renderNavigationGroup(adminNavigation, "admin", "Administration")}

          {/* Support Section */}
          {renderNavigationGroup(supportNavigation, "support", "Help & Support")}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.name || "Student"}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{user?.role || "Student"}</p>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-500" />
            <span className="text-xs font-medium">Pro</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
