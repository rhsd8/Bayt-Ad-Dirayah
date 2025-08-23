"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Types for form data
interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  dobYear: string
  dobMonth: string
  dobDay: string
  nationality: string
  referral: string
}

// Helper functions
function daysInMonth(year: number, month: number): number {
  if (!year || !month) return 31
  return new Date(year, month, 0).getDate()
}

function getYearOptions(): number[] {
  const now = new Date().getFullYear()
  const years: number[] = []
  for (let y = now; y >= now - 100; y--) {
    years.push(y)
  }
  return years
}

function getNationalityOptions(): { value: string; label: string }[] {
  return [
    { value: "AF", label: "Afghanistan" },
    { value: "AL", label: "Albania" },
    { value: "DZ", label: "Algeria" },
    { value: "AD", label: "Andorra" },
    { value: "AO", label: "Angola" },
    { value: "AG", label: "Antigua and Barbuda" },
    { value: "AR", label: "Argentina" },
    { value: "AM", label: "Armenia" },
    { value: "AU", label: "Australia" },
    { value: "AT", label: "Austria" },
    { value: "AZ", label: "Azerbaijan" },
    { value: "BS", label: "Bahamas" },
    { value: "BH", label: "Bahrain" },
    { value: "BD", label: "Bangladesh" },
    { value: "BB", label: "Barbados" },
    { value: "BY", label: "Belarus" },
    { value: "BE", label: "Belgium" },
    { value: "BZ", label: "Belize" },
    { value: "BJ", label: "Benin" },
    { value: "BT", label: "Bhutan" },
    { value: "BO", label: "Bolivia" },
    { value: "BA", label: "Bosnia and Herzegovina" },
    { value: "BW", label: "Botswana" },
    { value: "BR", label: "Brazil" },
    { value: "BN", label: "Brunei" },
    { value: "BG", label: "Bulgaria" },
    { value: "BF", label: "Burkina Faso" },
    { value: "BI", label: "Burundi" },
    { value: "CV", label: "Cabo Verde" },
    { value: "KH", label: "Cambodia" },
    { value: "CM", label: "Cameroon" },
    { value: "CA", label: "Canada" },
    { value: "CF", label: "Central African Republic" },
    { value: "TD", label: "Chad" },
    { value: "CL", label: "Chile" },
    { value: "CN", label: "China" },
    { value: "CO", label: "Colombia" },
    { value: "KM", label: "Comoros" },
    { value: "CG", label: "Congo" },
    { value: "CD", label: "Congo (Democratic Republic)" },
    { value: "CR", label: "Costa Rica" },
    { value: "CI", label: "Côte d'Ivoire" },
    { value: "HR", label: "Croatia" },
    { value: "CU", label: "Cuba" },
    { value: "CY", label: "Cyprus" },
    { value: "CZ", label: "Czech Republic" },
    { value: "DK", label: "Denmark" },
    { value: "DJ", label: "Djibouti" },
    { value: "DM", label: "Dominica" },
    { value: "DO", label: "Dominican Republic" },
    { value: "EC", label: "Ecuador" },
    { value: "EG", label: "Egypt" },
    { value: "SV", label: "El Salvador" },
    { value: "GQ", label: "Equatorial Guinea" },
    { value: "ER", label: "Eritrea" },
    { value: "EE", label: "Estonia" },
    { value: "SZ", label: "Eswatini" },
    { value: "ET", label: "Ethiopia" },
    { value: "FJ", label: "Fiji" },
    { value: "FI", label: "Finland" },
    { value: "FR", label: "France" },
    { value: "GA", label: "Gabon" },
    { value: "GM", label: "Gambia" },
    { value: "GE", label: "Georgia" },
    { value: "DE", label: "Germany" },
    { value: "GH", label: "Ghana" },
    { value: "GR", label: "Greece" },
    { value: "GD", label: "Grenada" },
    { value: "GT", label: "Guatemala" },
    { value: "GN", label: "Guinea" },
    { value: "GW", label: "Guinea-Bissau" },
    { value: "GY", label: "Guyana" },
    { value: "HT", label: "Haiti" },
    { value: "HN", label: "Honduras" },
    { value: "HU", label: "Hungary" },
    { value: "IS", label: "Iceland" },
    { value: "IN", label: "India" },
    { value: "ID", label: "Indonesia" },
    { value: "IR", label: "Iran" },
    { value: "IQ", label: "Iraq" },
    { value: "IE", label: "Ireland" },
    { value: "IT", label: "Italy" },
    { value: "JM", label: "Jamaica" },
    { value: "JP", label: "Japan" },
    { value: "JO", label: "Jordan" },
    { value: "KZ", label: "Kazakhstan" },
    { value: "KE", label: "Kenya" },
    { value: "KI", label: "Kiribati" },
    { value: "KP", label: "Korea (North)" },
    { value: "KR", label: "Korea (South)" },
    { value: "KW", label: "Kuwait" },
    { value: "KG", label: "Kyrgyzstan" },
    { value: "LA", label: "Laos" },
    { value: "LV", label: "Latvia" },
    { value: "LB", label: "Lebanon" },
    { value: "LS", label: "Lesotho" },
    { value: "LR", label: "Liberia" },
    { value: "LY", label: "Libya" },
    { value: "LI", label: "Liechtenstein" },
    { value: "LT", label: "Lithuania" },
    { value: "LU", label: "Luxembourg" },
    { value: "MG", label: "Madagascar" },
    { value: "MW", label: "Malawi" },
    { value: "MY", label: "Malaysia" },
    { value: "MV", label: "Maldives" },
    { value: "ML", label: "Mali" },
    { value: "MT", label: "Malta" },
    { value: "MH", label: "Marshall Islands" },
    { value: "MR", label: "Mauritania" },
    { value: "MU", label: "Mauritius" },
    { value: "MX", label: "Mexico" },
    { value: "FM", label: "Micronesia" },
    { value: "MD", label: "Moldova" },
    { value: "MC", label: "Monaco" },
    { value: "MN", label: "Mongolia" },
    { value: "ME", label: "Montenegro" },
    { value: "MA", label: "Morocco" },
    { value: "MZ", label: "Mozambique" },
    { value: "MM", label: "Myanmar" },
    { value: "NA", label: "Namibia" },
    { value: "NR", label: "Nauru" },
    { value: "NP", label: "Nepal" },
    { value: "NL", label: "Netherlands" },
    { value: "NZ", label: "New Zealand" },
    { value: "NI", label: "Nicaragua" },
    { value: "NE", label: "Niger" },
    { value: "NG", label: "Nigeria" },
    { value: "MK", label: "North Macedonia" },
    { value: "NO", label: "Norway" },
    { value: "OM", label: "Oman" },
    { value: "PK", label: "Pakistan" },
    { value: "PW", label: "Palau" },
    { value: "PS", label: "Palestine" },
    { value: "PA", label: "Panama" },
    { value: "PG", label: "Papua New Guinea" },
    { value: "PY", label: "Paraguay" },
    { value: "PE", label: "Peru" },
    { value: "PH", label: "Philippines" },
    { value: "PL", label: "Poland" },
    { value: "PT", label: "Portugal" },
    { value: "QA", label: "Qatar" },
    { value: "RO", label: "Romania" },
    { value: "RU", label: "Russia" },
    { value: "RW", label: "Rwanda" },
    { value: "KN", label: "Saint Kitts and Nevis" },
    { value: "LC", label: "Saint Lucia" },
    { value: "VC", label: "Saint Vincent and the Grenadines" },
    { value: "WS", label: "Samoa" },
    { value: "SM", label: "San Marino" },
    { value: "ST", label: "São Tomé and Príncipe" },
    { value: "SA", label: "Saudi Arabia" },
    { value: "SN", label: "Senegal" },
    { value: "RS", label: "Serbia" },
    { value: "SC", label: "Seychelles" },
    { value: "SL", label: "Sierra Leone" },
    { value: "SG", label: "Singapore" },
    { value: "SK", label: "Slovakia" },
    { value: "SI", label: "Slovenia" },
    { value: "SB", label: "Solomon Islands" },
    { value: "SO", label: "Somalia" },
    { value: "ZA", label: "South Africa" },
    { value: "SS", label: "South Sudan" },
    { value: "ES", label: "Spain" },
    { value: "LK", label: "Sri Lanka" },
    { value: "SD", label: "Sudan" },
    { value: "SR", label: "Suriname" },
    { value: "SE", label: "Sweden" },
    { value: "CH", label: "Switzerland" },
    { value: "SY", label: "Syria" },
    { value: "TJ", label: "Tajikistan" },
    { value: "TZ", label: "Tanzania" },
    { value: "TH", label: "Thailand" },
    { value: "TL", label: "Timor-Leste" },
    { value: "TG", label: "Togo" },
    { value: "TO", label: "Tonga" },
    { value: "TT", label: "Trinidad and Tobago" },
    { value: "TN", label: "Tunisia" },
    { value: "TR", label: "Turkey" },
    { value: "TM", label: "Turkmenistan" },
    { value: "TV", label: "Tuvalu" },
    { value: "UG", label: "Uganda" },
    { value: "UA", label: "Ukraine" },
    { value: "AE", label: "United Arab Emirates" },
    { value: "GB", label: "United Kingdom" },
    { value: "US", label: "United States" },
    { value: "UY", label: "Uruguay" },
    { value: "UZ", label: "Uzbekistan" },
    { value: "VU", label: "Vanuatu" },
    { value: "VA", label: "Vatican City" },
    { value: "VE", label: "Venezuela" },
    { value: "VN", label: "Vietnam" },
    { value: "YE", label: "Yemen" },
    { value: "ZM", label: "Zambia" },
    { value: "ZW", label: "Zimbabwe" }
  ]
}

// Custom Dropdown Component
interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  "aria-label": string
}

function AnimatedDropdown({ value, onChange, options, placeholder, "aria-label": ariaLabel }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-full rounded-md appearance-none bg-background text-foreground border border-input px-3 text-sm shadow-sm hover:bg-accent focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring transition-all flex items-center justify-between"
      >
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover text-popover-foreground border border-border rounded-md shadow-lg max-h-60 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="max-h-48 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Progress Indicator Component
function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round((currentStep / totalSteps) * 100)}% complete
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
              i + 1 < currentStep
                ? "bg-primary border-primary text-primary-foreground"
                : i + 1 === currentStep
                ? "border-primary text-primary bg-primary/10"
                : "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            {i + 1 < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-sm font-medium">{i + 1}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const params = useParams()
  const lang = (params?.lang as string) || "en"

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dobYear: "",
    dobMonth: "",
    dobDay: "",
    nationality: "",
    referral: ""
  })

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null) // Clear error when user types
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          setError("First name is required")
          return false
        }
        if (!formData.lastName.trim()) {
          setError("Last name is required")
          return false
        }
        if (!formData.email.trim()) {
          setError("Email is required")
          return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError("Please enter a valid email address")
          return false
        }
        if (!formData.password) {
          setError("Password is required")
          return false
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters")
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return false
        }
        return true

      case 2:
        if (!formData.dobYear || !formData.dobMonth || !formData.dobDay) {
          setError("Please select your complete date of birth")
          return false
        }
        if (!formData.nationality) {
          setError("Please select your nationality")
          return false
        }
        return true

      case 3:
        if (!formData.referral) {
          setError("Please select how you heard about us")
          return false
        }
        return true

      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError(null)
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setError(null)
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    try {
      setLoading(true)
      setError(null)

      // Build ISO date string
      const mm = String(formData.dobMonth).padStart(2, "0")
      const dd = String(formData.dobDay).padStart(2, "0")
      const dob = `${formData.dobYear}-${mm}-${dd}`

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/${lang}/login` : undefined,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            dob: dob,
            nationality: formData.nationality,
            referral: formData.referral,
          },
        },
      })

      if (error) throw error

      setMessage("Account created! Check your email to verify your account.")
      // Optionally redirect after a delay
      // setTimeout(() => router.push(`/${lang}/login`), 3000)
    } catch (err: any) {
      setError(err?.message || "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  const referralOptions = [
    { value: "friend", label: "Friend or family member" },
    { value: "social", label: "Social Media (Facebook, Instagram, etc.)" },
    { value: "search", label: "Search Engine (Google, Bing, etc.)" },
    { value: "ad", label: "Online Advertisement" },
    { value: "youtube", label: "YouTube" },
    { value: "blog", label: "Blog or Article" },
    { value: "other", label: "Other" }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join our Arabic learning community
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <ProgressIndicator currentStep={currentStep} totalSteps={3} />

          <form className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-5 duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      placeholder="Enter first name"
                      className="transition-all focus:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      placeholder="Enter last name"
                      className="transition-all focus:scale-105"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="Enter your email"
                    className="transition-all focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    placeholder="Create a password"
                    className="transition-all focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="transition-all focus:scale-105"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-5 duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                </div>

                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <AnimatedDropdown
                      aria-label="Month"
                      value={formData.dobMonth}
                      onChange={(value) => updateFormData("dobMonth", value)}
                      placeholder="Month"
                      options={[
                        { value: "1", label: "January" },
                        { value: "2", label: "February" },
                        { value: "3", label: "March" },
                        { value: "4", label: "April" },
                        { value: "5", label: "May" },
                        { value: "6", label: "June" },
                        { value: "7", label: "July" },
                        { value: "8", label: "August" },
                        { value: "9", label: "September" },
                        { value: "10", label: "October" },
                        { value: "11", label: "November" },
                        { value: "12", label: "December" }
                      ]}
                    />
                    <AnimatedDropdown
                      aria-label="Day"
                      value={formData.dobDay}
                      onChange={(value) => updateFormData("dobDay", value)}
                      placeholder="Day"
                      options={Array.from({ length: daysInMonth(Number(formData.dobYear || 2000), Number(formData.dobMonth || 1)) }, (_, i) => ({
                        value: (i + 1).toString(),
                        label: (i + 1).toString()
                      }))}
                    />
                    <AnimatedDropdown
                      aria-label="Year"
                      value={formData.dobYear}
                      onChange={(value) => updateFormData("dobYear", value)}
                      placeholder="Year"
                      options={getYearOptions().map(y => ({
                        value: y.toString(),
                        label: y.toString()
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nationality</Label>
                  <AnimatedDropdown
                    aria-label="Nationality"
                    value={formData.nationality}
                    onChange={(value) => updateFormData("nationality", value)}
                    placeholder="Select your nationality"
                    options={getNationalityOptions()}
                  />
                </div>
              </div>
            )}

            {/* Step 3: How did you hear about us */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-5 duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Almost Done!</h2>
                </div>

                <div className="space-y-3">
                  <Label>How did you hear about us?</Label>
                  <div className="space-y-3">
                    {referralOptions.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent",
                          formData.referral === option.value 
                            ? "border-primary bg-primary/5" 
                            : "border-border"
                        )}
                      >
                        <input
                          type="radio"
                          name="referral"
                          value={option.value}
                          checked={formData.referral === option.value}
                          onChange={(e) => updateFormData("referral", e.target.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error and Success Messages */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg animate-in fade-in-0 duration-200">
                {error}
              </div>
            )}
            {message && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg animate-in fade-in-0 duration-200">
                {message}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={cn(
                  "transition-all",
                  currentStep === 1 ? "invisible" : "visible"
                )}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="transition-all hover:scale-105"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="transition-all hover:scale-105"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={`/${lang}/login`} className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href={`/${lang}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}