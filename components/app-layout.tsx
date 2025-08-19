"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { AppSidebar } from "@/components/sidebar"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { ErrorBoundary } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Flame,
  Trophy,
  Target,
  Calendar,
  Activity,
  Grid,
  List,
} from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
  lang: string
  dictionary: any
  title?: string
  description?: string
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  action?: {
    label: string
    href: string
  }
}

export function AppLayout({
  children,
  lang,
  dictionary,
  title,
  description,
  actions,
  breadcrumbs = [],
}: AppLayoutProps) {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const searchFlashTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [searchFlash, setSearchFlash] = useState(false)

  // Load notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "New Achievement Unlocked!",
        message: "You've completed your 7-day study streak",
        type: "success",
        timestamp: "2024-01-16T10:30:00Z",
        read: false,
        action: {
          label: "View Achievement",
          href: `/${lang}/achievements`,
        },
      },
      {
        id: "2",
        title: "Quiz Available",
        message: "New grammar quiz is ready for you",
        type: "info",
        timestamp: "2024-01-16T09:15:00Z",
        read: false,
        action: {
          label: "Take Quiz",
          href: `/${lang}/quiz`,
        },
      },
      {
        id: "3",
        title: "Study Reminder",
        message: "Don't forget your daily Arabic lesson",
        type: "warning",
        timestamp: "2024-01-16T08:00:00Z",
        read: true,
      },
      {
        id: "4",
        title: "Community Update",
        message: "5 new replies in your discussion thread",
        type: "info",
        timestamp: "2024-01-15T18:30:00Z",
        read: true,
        action: {
          label: "View Discussion",
          href: `/${lang}/community`,
        },
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [lang])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery)
    }
  }

  const handleSearchToggle = () => {
    const newExpandedState = !isSearchExpanded
    setIsSearchExpanded(newExpandedState)
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // If expanding, set timeout to auto-hide after 5 seconds
    if (newExpandedState) {
      searchTimeoutRef.current = setTimeout(() => {
        console.log("Auto-hiding search after 5 seconds (initial expand)")
        setIsSearchExpanded(false)
      }, 5000)
    }

    // Flash stronger shadow briefly when opening
    if (newExpandedState) {
      if (searchFlashTimeoutRef.current) clearTimeout(searchFlashTimeoutRef.current)
      setSearchFlash(true)
      searchFlashTimeoutRef.current = setTimeout(() => setSearchFlash(false), 1000)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Reset timeout on input change
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    // Set new timeout to auto-hide after 15 seconds when user types
    searchTimeoutRef.current = setTimeout(() => {
      console.log("Auto-hiding search after 15 seconds of inactivity (user typed)")
      setIsSearchExpanded(false)
    }, 15000)
  }

  // Close search when clicking outside the search area (button + input popover)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false)
      }
    }
    if (isSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchExpanded])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const days = Math.floor(diffInHours / 24)
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return time.toLocaleDateString()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Trophy className="h-4 w-4 text-green-600" />
      case "warning":
        return <Calendar className="h-4 w-4 text-yellow-600" />
      case "error":
        return <Target className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-blue-600" />
    }
  }

  

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <AppSidebar lang={lang} dictionary={dictionary} />
        <SidebarInset>
          {/* Header */}
          <header className="fixed md:sticky top-0 md:top-3 z-40 w-full bg-transparent">
            {/* Mobile Apple-style bar */}
          <div className="md:hidden border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-16 px-4 flex items-center justify-between gap-2 text-foreground">
              {/* Left: Logo */}
              <Link href={`/${lang}`} className="flex items-center" aria-label="Home" title="Home">
                <Image src="/logo-web-light.webp" alt="Bayt Ad Dirayah" width={28} height={28} className="h-7 w-auto dark:hidden" priority />
                <Image src="/logo-web-dark.webp" alt="Bayt Ad Dirayah" width={28} height={28} className="h-7 w-auto hidden dark:inline" priority />
              </Link>
              {/* Center: empty */}
              <div className="flex-1" />
              {/* Right: Mobile hamburger */}
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  title="Open menu"
                  onClick={() => setMobileMenuOpen(true)}
                  className="h-10 w-10"
                >
                  {/* Hamburger icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile full-screen overlay menu */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-background text-foreground">
              <div className="absolute inset-0 overflow-y-auto">
                {/* Top bar with close */}
                <div className="h-16 px-4 flex items-center justify-between border-b border-border/60">
                  <Link href={`/${lang}`} className="flex items-center" aria-label="Home" title="Home" onClick={() => setMobileMenuOpen(false)}>
                    <Image src="/logo-web-light.webp" alt="Bayt Ad Dirayah" width={28} height={28} className="h-7 w-auto dark:hidden" priority />
                    <Image src="/logo-web-dark.webp" alt="Bayt Ad Dirayah" width={28} height={28} className="h-7 w-auto hidden dark:inline" priority />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close menu"
                    title="Close menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-10 w-10"
                  >
                    {/* X icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </Button>
                </div>

                {/* Slide-down panel */}
                <div className="animate-in slide-in-from-top-4 duration-300 ease-out p-4 space-y-2">
                  <nav className="flex flex-col gap-2">
                    <Link href={`/${lang}/dashboard`} className="px-4 py-3 rounded-lg bg-muted/60 hover:bg-muted transition" onClick={() => setMobileMenuOpen(false)}>
                      {t("nav.dashboard", "Dashboard")}
                    </Link>
                    <Link href={`/${lang}/courses`} className="px-4 py-3 rounded-lg bg-muted/60 hover:bg-muted transition" onClick={() => setMobileMenuOpen(false)}>
                      {t("nav.courses", "Learning")}
                    </Link>
                    {/* Progress & Stats intentionally hidden on mobile */}
                    <Link href={`/${lang}/settings`} className="px-4 py-3 rounded-lg bg-muted/60 hover:bg-muted transition" onClick={() => setMobileMenuOpen(false)}>
                      {t("nav.settings", "Settings")}
                    </Link>
                    <Link href={`/${lang}/help`} className="px-4 py-3 rounded-lg bg-muted/60 hover:bg-muted transition" onClick={() => setMobileMenuOpen(false)}>
                      {t("nav.support", "Help & Support")}
                    </Link>
                  </nav>

                  <div className="pt-4">
                    <Button className="w-full" variant="destructive" onClick={() => { setMobileMenuOpen(false); logout(); }}>
                      {t("auth.sign_out", "Sign Out")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Desktop header (existing) */}
            <div className="hidden md:block px-10 py-7">
              <div className="flex h-20 items-center gap-6 w-full rounded-full border border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 shadow-sm">
                <div className="flex items-center gap-6 flex-1 px-8">
                  <SidebarTrigger className="-ml-1" title="Toggle sidebar" />
                  <Separator orientation="vertical" className="mr-2 h-6" />
                  <Link href={`/${lang}`} className="flex items-center gap-2" aria-label="Bayt Ad Dirayah Home" title="Home">
                    <Image
                      src="/logo-web-light.webp"
                      alt="Bayt Ad Dirayah"
                      width={130}
                      height={30}
                      className="h-10 w-auto align-middle translate-y-[2px] dark:hidden"
                      priority
                    />
                    <Image
                      src="/logo-web-dark.webp"
                      alt="Bayt Ad Dirayah"
                      width={130}
                      height={30}
                      className="h-10 w-auto align-middle translate-y-[2px] hidden dark:inline"
                      priority
                    />
                  </Link>
                  <Separator orientation="vertical" className="mx-2 h-6" />

                  {/* Enhanced Breadcrumbs */}
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href={`/${lang}/dashboard`}>{t("nav.dashboard", "Dashboard")}</BreadcrumbLink>
                      </BreadcrumbItem>
                      {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center">
                          <BreadcrumbSeparator className="hidden md:block" />
                          <BreadcrumbItem>
                            {crumb.href ? (
                              <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                            ) : (
                              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            )}
                          </BreadcrumbItem>
                        </div>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Enhanced Search */}
                <div className="flex items-center gap-2 pr-3">
                  <div className="relative hidden md:block" ref={searchRef}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSearchToggle}
                      className="h-8 w-8 p-0 transition-all duration-200 hover:bg-muted"
                    >
                      <Search className="h-4 w-4 transition-transform duration-200" />
                    </Button>
                    <div className={`absolute right-0 top-0 z-50 transition-all duration-300 ease-in-out ${
                      isSearchExpanded 
                        ? "opacity-100 translate-x-0 scale-100" 
                        : "opacity-0 translate-x-4 scale-95 pointer-events-none"
                    }`}>
                      <form onSubmit={handleSearch}>
                        <Input
                          type="search"
                          placeholder={t("search.placeholder", "Search courses, notes, discussions...")}
                          value={searchQuery}
                          onChange={handleSearchInputChange}
                          onFocus={() => {
                            if (searchFlashTimeoutRef.current) clearTimeout(searchFlashTimeoutRef.current)
                            setSearchFlash(true)
                            searchFlashTimeoutRef.current = setTimeout(() => setSearchFlash(false), 1000)
                          }}
                          className={`pl-4 pr-4 w-72 rounded-full bg-primary text-foreground border-0 appearance-none ring-0 ring-transparent focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-transparent focus:outline-none focus-visible:outline-none focus:border-transparent focus-visible:border-transparent ring-offset-0 focus:ring-offset-0 ${searchFlash ? "shadow-2xl" : "shadow-lg"} transition-all placeholder:text-muted-foreground`}
                          autoFocus
                        />
                      </form>
                    </div>
                  </div>

                  {/* Fullscreen Toggle removed */}

                  {/* Enhanced Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
                        <Bell className="h-4 w-4" />
                        {unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-pulse"
                          >
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-0">
                      <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                            Mark all read
                          </Button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer ${
                                !notification.read ? "bg-primary/5" : ""
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{notification.message}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimeAgo(notification.timestamp)}
                                    </span>
                                    {notification.action && (
                                      <Button variant="ghost" size="sm" className="text-xs h-6">
                                        {notification.action.label}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
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
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user?.avatar || "/placeholder-user.jpg"}
                            alt={user?.name || "Profile"}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none truncate">
                              {(() => {
                                const byName = user?.name?.trim().split(" ")[0]
                                const byEmail = user?.email ? user.email.split("@")[0] : ""
                                const dn = byName || byEmail
                                return dn ? dn.charAt(0).toUpperCase() + dn.slice(1) : ""
                              })()}
                            </p>
                            {user?.email && (
                              <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Flame className="h-3 w-3 text-orange-500" />7 day streak
                          </div> */}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Quick Stats */}
                    <div className="px-2 py-2">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <div className="text-lg font-bold text-primary">47</div>
                          <div className="text-xs text-muted-foreground">Lessons</div>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                          <div className="text-lg font-bold text-green-600">15</div>
                          <div className="text-xs text-muted-foreground">Badges</div>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                          <div className="text-lg font-bold text-yellow-600">#23</div>
                          <div className="text-xs text-muted-foreground">Rank</div>
                        </div>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="gap-2">
                      <User className="h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Activity className="h-4 w-4" />
                      Learning Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Trophy className="h-4 w-4" />
                      Achievements
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600" onClick={logout}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              </div>
            </div>
          </header>

          {/* Spacer to account for fixed mobile header */}
          <div className="h-16 md:hidden" />

          {/* Enhanced Page Header */}
          {(title || description || actions) && (
            <div className="border-b bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
                  {description && <p className="text-muted-foreground">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundary>
  )
}
