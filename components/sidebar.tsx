"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
      color: "text-foreground",
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
        // {
        //   title: "Certificates",
        //   icon: Award,
        //   href: `/${lang}/certificates`,
        //   isActive: pathname === `/${lang}/certificates`,
        //   badge: 3,
        //   color: "text-yellow-600",
        // },
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
        <Collapsible
          open={state === "collapsed" ? true : isExpanded}
          onOpenChange={state === "collapsed" ? undefined : () => toggleGroup(groupId)}
        >
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger
              className={cn(
                "group/collapsible w-full flex items-center justify-between hover:bg-muted/50 rounded-md p-2 transition-colors",
                state === "collapsed" && "hidden"
              )}
            >
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
                        className={cn(
                          "flex items-center w-full rounded-lg transition-colors hover:bg-muted group",
                          state === "collapsed" ? "justify-center px-0 py-2" : "justify-between px-2 py-1.5"
                        )}
                        title={item.title}
                      >
                        {/* Icon + Text (Left side) */}
                        <div className={cn("flex items-center min-w-0", state === "collapsed" ? "gap-0" : "gap-3") }>
                          {groupId === "support" || groupId === "learning" ? (
                            <div className="shrink-0 flex items-center justify-center">
                              <item.icon
                                className={cn(
                                  "h-5 w-5",
                                  item.color ? item.color : (item.isActive ? "text-primary" : "text-muted-foreground")
                                )}
                              />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "p-2 rounded-md transition-colors shrink-0 flex items-center justify-center",
                                item.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:bg-accent"
                              )}
                            >
                              <item.icon className="h-5 w-5" />
                            </div>
                          )}
                          <span
                            className={cn(
                              "truncate font-semibold text-base",
                              (groupId === "support" || groupId === "learning") ? "text-foreground" : "text-primary",
                              state === "collapsed" && "hidden"
                            )}
                          >
                            {item.title}
                          </span>
                        </div>

                        {/* New item indicator (Right side) */}
                        {item.isNew && state !== "collapsed" && (
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
      <SidebarHeader className={cn("border-b", state === "collapsed" ? "p-2 overflow-hidden" : "p-4") }>
        <Link
          href={`/${lang}`}
          className={cn(
            "flex items-center gap-2",
            state === "collapsed" ? "justify-center w-full gap-0" : undefined
          )}
          aria-label="Bayt Ad Dirayah Home"
        >
          {state === "collapsed" ? (
            <Image
              src={lang === "ar" ? "/logo-web-dark-ar.webp" : "/logo-web-light-en.webp"}
              alt="Bayt Ad Dirayah"
              width={140}
              height={32}
              className="h-auto w-auto max-h-6 max-w-[28px] object-contain"
              priority
            />
          ) : (
            <>
              <Image
                src="/logo-web-light.webp"
                alt="Bayt Ad Dirayah"
                width={140}
                height={32}
                className="h-8 w-auto dark:hidden shrink-0"
                priority
              />
              <Image
                src="/logo-web-dark.webp"
                alt="Bayt Ad Dirayah"
                width={140}
                height={32}
                className="h-8 w-auto hidden dark:inline shrink-0"
                priority
              />
            </>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn(state === "collapsed" && "px-0")}>
        <ScrollArea className={cn("flex-1", state === "collapsed" && "px-0") }>
          {state === "collapsed" ? (
            <>
              {/* Quick icons when collapsed (reduced set) */}
              <SidebarGroup className="px-0">
                <SidebarMenu className="px-0 w-[5rem] mx-auto">
                  {[
                    { title: t("nav.dashboard", "Dashboard"), href: `/${lang}/dashboard`, icon: Home, isActive: pathname === `/${lang}/dashboard` },
                    { title: t("nav.courses", "Learning"), href: `/${lang}/courses`, icon: BookOpen, isActive: pathname.startsWith(`/${lang}/courses`) },
                    // Hidden for now: Learning Tools, Resources, Study Tools, Community, Progress & Stats
                    // { title: t("nav.learning_tools", "Learning Tools"), href: `/${lang}/quiz`, icon: Brain, isActive: pathname.startsWith(`/${lang}/quiz`) || pathname.startsWith(`/${lang}/flashcards`) },
                    // { title: t("nav.materials", "Resources"), href: `/${lang}/materials`, icon: Library, isActive: pathname.startsWith(`/${lang}/materials`) },
                    // { title: t("nav.study", "Study Tools"), href: `/${lang}/notes`, icon: FileText, isActive: pathname.startsWith(`/${lang}/notes`) || pathname.startsWith(`/${lang}/study`) },
                    // { title: t("nav.community", "Community"), href: `/${lang}/community`, icon: Users, isActive: pathname.startsWith(`/${lang}/community`) },
                    // { title: t("nav.progress", "Progress & Stats"), href: `/${lang}/analytics`, icon: BarChart3, isActive: pathname.startsWith(`/${lang}/analytics`) || pathname.startsWith(`/${lang}/progress`) },
                  ].map((item) => (
                    <SidebarMenuItem key={item.title} className={cn(state === "collapsed" && "px-0 w-[5rem] mx-auto") }>
                      <SidebarMenuButton asChild isActive={item.isActive} className={cn(state === "collapsed" && "px-0 w-[5rem] mx-auto") }>
                        <Link
                          href={item.href}
                          className={cn("grid w-[5rem] place-items-center px-0 py-4 mx-auto hover:bg-muted/30 rounded-lg transition-colors")}
                          title={item.title}
                        >
                          <item.icon
                            className={cn(
                              "h-20 w-20 shrink-0 transition-colors",
                              item.isActive ? "text-foreground" : "text-foreground hover:text-foreground"
                            )}
                          />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </>
          ) : (
            <>
              {/* Main Navigation */}
              <SidebarGroup>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <Link
                          href={item.href || "#"}
                          className={cn(
                            "flex items-center rounded-lg transition-colors hover:bg-muted",
                            "gap-3 px-2 py-1.5"
                          )}
                          title={item.title}
                        >
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

              {/* Tools Section (hidden for now) */}
              {/** renderNavigationGroup(toolsNavigation, "tools", "Learning Tools") */}

              {/* Materials Section (hidden for now) */}
              {/** renderNavigationGroup(materialsNavigation, "materials", "Resources") */}

              {/* Study Section (hidden for now) */}
              {/** renderNavigationGroup(studyNavigation, "study", "Study Tools") */}

              {/* Community Section (hidden for now) */}
              {/** renderNavigationGroup(communityNavigation, "community", "Community") */}

              {/* Progress Section (hidden for now) */}
              {/** renderNavigationGroup(progressNavigation, "progress", "Progress & Stats") */}

              {/* Admin Section */}
              {adminNavigation.length > 0 && renderNavigationGroup(adminNavigation, "admin", "Administration")}

              {/* Support Section */}
              {renderNavigationGroup(supportNavigation, "support", "Help & Support")}
            </>
          )}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={user?.avatar || "/placeholder-user.jpg"}
              alt={user?.name || "Profile"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          {state !== "collapsed" && (
            <>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name?.trim().split(" ")[0] || ""}</p>
                {user?.role && (
                  <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
                )}
              </div>
              {/** Pro label removed temporarily until pricing is available **/}
            </>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
