"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  BookOpen,
  Users,
  Trophy,
  Play,
  GraduationCap,
  Sparkles,
  Brain,
  Volume2,
  PenTool,
  Mail,
  Globe,
  MessageCircle,
  Menu,
  X,
} from "lucide-react"

interface LandingPageProps {
  lang: string
  dictionary: Record<string, unknown>
}

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}



export function LandingPage({ lang, dictionary }: LandingPageProps) {
  const { isRTL } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLogoCardOpen, setIsLogoCardOpen] = useState(false)
  const [isLogoCardClosing, setIsLogoCardClosing] = useState(false)
  const logoBtnRef = useRef<HTMLButtonElement | null>(null)
  const [logoCardPos, setLogoCardPos] = useState<{ top: number; left: number } | null>(null)
  const [isLogoCardStarting, setIsLogoCardStarting] = useState(false)


  // Safe dictionary access with fallbacks
  const safeDict = {
    common: dictionary?.common || {},
    navigation: dictionary?.navigation || {},
    landing: dictionary?.landing || {},
  }

  const features: Feature[] = [
    {
      icon: BookOpen,
      title: safeDict.landing.features?.interactive_lessons || "Interactive Lessons",
      description:
        safeDict.landing.features?.interactive_lessons_desc ||
        "Learn Arabic through engaging, interactive lessons designed by language experts",
      color: "text-blue-600",
    },
    {
      icon: Brain,
      title: safeDict.landing.features?.ai_powered || "AI-Powered Learning",
      description:
        safeDict.landing.features?.ai_powered_desc ||
        "Personalized learning paths adapted to your pace and learning style",
      color: "text-purple-600",
    },
    {
      icon: Volume2,
      title: safeDict.landing.features?.pronunciation || "Pronunciation Practice",
      description:
        safeDict.landing.features?.pronunciation_desc ||
        "Perfect your Arabic pronunciation with advanced speech recognition",
      color: "text-green-600",
    },
    {
      icon: PenTool,
      title: safeDict.landing.features?.writing || "Writing Practice",
      description:
        safeDict.landing.features?.writing_desc || "Master Arabic script with guided writing exercises and feedback",
      color: "text-orange-600",
    },
    {
      icon: Users,
      title: safeDict.landing.features?.community || "Learning Community",
      description:
        safeDict.landing.features?.community_desc || "Connect with fellow learners and native speakers worldwide",
      color: "text-indigo-600",
    },
    {
      icon: Trophy,
      title: safeDict.landing.features?.gamification || "Earn Achivements",
      description:
        safeDict.landing.features?.gamification_desc || "Earn badges, maintain streaks, and compete with friends",
      color: "text-yellow-600",
    },
  ]

  // Testimonials commented out as section is not currently used

  // const stats: Stat[] = [
  //   {
  //     value: "50K+",
  //     label: "Active Learners",
  //     icon: Users,
  //     color: "text-blue-600",
  //   },
  //   {
  //     value: "1000+",
  //     label: "Lessons Available",
  //     icon: BookOpen,
  //     color: "text-green-600",
  //   },
  //   {
  //     value: "95%",
  //     label: "Success Rate",
  //     icon: TrendingUp,
  //     color: "text-purple-600",
  //   },
  //   {
  //     value: "24/7",
  //     label: "Support Available",
  //     icon: Shield,
  //     color: "text-orange-600",
  //   },
  // ]

  const navigation: { name: string; href: string }[] = [
    // { name: safeDict.navigation.home || "Home", href: "#home" },
    // { name: safeDict.navigation.features || "Features", href: "#features" },
    // { name: safeDict.navigation.courses || "Courses", href: "#courses" },
    // { name: safeDict.common.about || "About", href: "#about" },
  ]

  // Newsletter signup handler commented out as form is not currently used

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed md:sticky top-0 md:top-3 z-50 w-full bg-transparent">
        {/* Mobile Apple-style bar */}
        <div className="md:hidden border-b border-border/60 bg-background/90">
          <div className="h-16 px-4 flex items-center justify-between gap-2 text-foreground">
            {/* Left: Logo */}
            <button
              type="button"
              ref={logoBtnRef}
              onClick={() => {
                const rect = logoBtnRef.current?.getBoundingClientRect()
                const top = (rect?.bottom || 0) + 8 + window.scrollY
                const desiredLeft = (rect?.left || 0) + window.scrollX
                const cardWidth = 288 // w-72
                const padding = 16
                const maxLeft = window.scrollX + window.innerWidth - padding - cardWidth
                const left = Math.max(padding, Math.min(desiredLeft, maxLeft))
                setLogoCardPos({ top, left })
                setIsLogoCardOpen(true)
                setIsLogoCardClosing(false)
                setIsLogoCardStarting(true)
                // allow layout to paint then remove starting to trigger morph
                setTimeout(() => setIsLogoCardStarting(false), 20)
              }}
              className="flex items-center"
              aria-label="Open account options"
              title="Account"
            >
              <Image src="/logo-web-light.webp" alt="Bayt Ad Dirayah" width={28} height={28} className="h-7 w-auto dark:hidden" priority />
              <Image src="/logo-web-dark.webp" alt="Bayt Ad Dirayah" width={28} height={28} className="h-7 w-auto hidden dark:inline" priority />
            </button>
            {/* Center: empty for minimalist look */}
            <div className="flex-1" />
            {/* Right: Sign In, Bag, Menu */}
            <div className="flex items-center gap-1.5">
              <Button asChild variant="ghost" size="sm" className="px-2.5 h-10 text-sm font-semibold">
                <Link href={`/${lang}/login`} title="Sign In">Sign In</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop header (unchanged) */}
        <div className="hidden md:block px-10 py-7">
          <div className="container mx-auto px-0 mx-1">
            <div className="flex h-20 items-center justify-between gap-6 rounded-full border border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 shadow-sm px-8 text-foreground">
              <div className="flex items-center gap-6">
                <Link
                  href={`/${lang}`}
                  className="flex items-center gap-2"
                  aria-label="Bayt Ad Dirayah Home"
                  title="Home"
                >
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
              </div>

              <nav className="hidden md:flex items-center gap-6">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="text-base md:text-lg font-semibold text-foreground/80 hover:text-foreground transition-colors"
                    title={item.name}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-5 text-foreground">
                {/* Moved ThemeToggle and LanguageSwitcher to footer */}
                <Button asChild variant="ghost" size="default" className="hidden sm:inline-flex text-foreground text-base md:text-lg font-semibold" title="Sign In">
                  <Link href={`/${lang}/login`} title="Sign In">
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-border bg-background">
              <div className="container mx-auto px-4 space-y-1.5">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="pt-2 border-t border-border mt-2">
                  <Button asChild className="w-full">
                    <Link href={`/${lang}/login`}>Start Learning</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile: ChatGPT-style logo card overlay */}
      {(isLogoCardOpen || isLogoCardClosing) && (
        <div
          className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-200 ${
            isLogoCardClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={() => {
            setIsLogoCardClosing(true)
            setTimeout(() => {
              setIsLogoCardOpen(false)
              setIsLogoCardClosing(false)
            }, 180)
          }}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className={`absolute z-[61] w-72 min-h-[14rem] bg-background text-foreground shadow-2xl border border-border/50 p-5 transition-all duration-200 ease-out ${
              isLogoCardClosing || isLogoCardStarting ? "scale-95 opacity-0" : "scale-100 opacity-100"
            } ${isLogoCardClosing || isLogoCardStarting ? "rounded-full" : "rounded-2xl"}`}
            style={{ top: logoCardPos?.top ?? 80, left: logoCardPos?.left ?? 16, transformOrigin: "top left" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Welcome to Bayt Ad Dirayah</h3>
              <p className="text-sm text-muted-foreground">
                Create an account or log in to access all features.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button asChild className="rounded-full px-5 h-10">
                <Link href={`/${lang}/login`}>Log in</Link>
              </Button>
              <Button asChild variant="secondary" className="rounded-full px-5 h-10">
                <Link href={`/${lang}/register`}>Sign up for free</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to account for fixed mobile header */}
      <div className="h-16 md:hidden" />

      {/* Hero Section (solid background, tighter spacing) */}
      <section
        id="home"
        className="relative bg-background py-10 lg:py-14"
      >

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isRTL ? "lg:order-2" : ""}`}>
              <div className="space-y-4">
                <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New: AI-Powered Learning Experience
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Master Arabic with Confidence
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {safeDict.landing.hero?.subtitle ||
                    "Join thousands of learners mastering Arabic through our innovative, interactive platform designed for modern language learning."}
                </p>
              </div>

              <div className="flex justify-center sm:justify-start">
                <Button asChild variant="outline" size="lg" className="gap-2 text-lg px-8 rounded-full border-2" style={{borderRadius: '9999px'}}>
                  <Link href={`/${lang}/login`}>
                    <Play className="h-5 w-5" />
                    Start Learning Free
                  </Link>
                </Button>
              </div>

              {/* Quick stats */}
              {/* <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Success</div>
                </div>
              </div> */}
            </div>

            <div className={`${isRTL ? "lg:order-1" : ""}`}>
              <div className="relative">
                <div className="relative bg-background rounded-3xl p-8 border">
                  <div className="space-y-6">
                    Arabic Learning Course
                    <div className="bg-background rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-secondry" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Arabic Alphabet</h3>
                          <p className="text-sm text-muted-foreground">Lesson 1 of 28</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-white rounded-full"></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">75%</span>
                        </div>
                      </div>
                    </div>

                    {/* Mock achievement */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Achievement Unlocked!</h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">First Week Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Removed floating decorative elements for a clean solid background */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (solid background, tighter spacing) */}
      <section id="features" className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Learn Master Arabic
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines traditional learning methods with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="relative group hover:shadow-lg transition-all duration-300 border bg-background"
                >
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-muted/80 text-muted-foreground text-xs font-medium px-3 py-3 rounded-full">
                      Coming Soon!
                    </span>
                  </div>
                  <CardHeader className="relative">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="group-hover:text-foreground transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section (tighter spacing) */}
      {/* <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold mb-2 group-hover:text-foreground transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section> */}

      {/* Enhanced Testimonials Section */}
      {/* <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our <span className="text-primary">Students Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their Arabic skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="relative group hover:shadow-lg transition-all duration-300 bg-background/60 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Enhanced Pricing Section */}
      {/* <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Pricing</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Choose Your <span className="text-primary">Learning Plan</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you progress in your Arabic learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"> */}
            {/* Free Plan */}
            {/* <Card className="relative group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold">$0</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">5 lessons per day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Basic vocabulary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Community access</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href={`/${lang}/login`}>Get Started Free</Link>
                </Button>
              </CardContent>
            </Card> */}

            {/* Pro Plan */}
            {/* <Card className="relative group hover:shadow-lg transition-all duration-300 border-primary/50 bg-primary/5">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Crown className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold">
                  $19<span className="text-lg text-muted-foreground">/mo</span>
                </div>
                <CardDescription>For serious learners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Advanced features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Pronunciation practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/${lang}/login`}>Start Pro Trial</Link>
                </Button>
              </CardContent>
            </Card> */}

            {/* Premium Plan */}
            {/* <Card className="relative group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="text-4xl font-bold">
                  $39<span className="text-lg text-muted-foreground">/mo</span>
                </div>
                <CardDescription>Complete learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">1-on-1 tutoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Custom learning path</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href={`/${lang}/login`}>Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Enhanced Newsletter Section */}
      {/* <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Learning Tips
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Get weekly Arabic learning tips, cultural insights, and exclusive content delivered to your inbox
            </p>

            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>

            {message && (
              <p className="mt-4 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">{message}</p>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

 */}

      {/* Enhanced Footer */}
      <footer className="bg-muted/50 py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold">Harf Project</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional Arabic language learning platform designed to help you master Arabic through interactive
                courses and expert guidance.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Globe className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              {/* Controls moved from header */}
              <div className="flex items-center gap-3 pt-2">
                <ThemeToggle className="h-9 w-9" tooltip="Toggle theme" />
                <LanguageSwitcher
                  currentLang={lang}
                  className="text-sm font-medium"
                  tooltip="Switch language"
                />
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => handleNavClick("#features")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </button>
                <Link
                  href={`/${lang}/courses`}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Courses
                </Link>
                <Link
                  href={`/${lang}/materials`}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Materials
                </Link>
                <button
                  onClick={() => handleNavClick("#pricing")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </button>
              </div>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => handleNavClick("#about")}
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </button>

                <button className="block text-muted-foreground hover:text-foreground transition-colors">Careers</button>
                <button className="block text-muted-foreground hover:text-foreground transition-colors">Blog</button>
              </div>
            </div>

            {/* Support Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2 text-sm">
                <button className="block text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </button>
                <button className="block text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </button>
                <button className="block text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </button>
                <button className="block text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 Arabic Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
