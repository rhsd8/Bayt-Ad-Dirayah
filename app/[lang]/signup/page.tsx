"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"

// Helpers for DOB dropdowns
function daysInMonth(year: number, month: number): number {
  // month: 1-12
  if (!year || !month) return 31
  return new Date(year, month, 0).getDate()
}

function getYearOptions(): number[] {
  const now = new Date().getFullYear()
  const years: number[] = []
  // Reasonable range: last 100 years
  for (let y = now; y >= now - 100; y--) {
    years.push(y)
  }
  return years
}

function getCountryOptions(): { value: string; label: string }[] {
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
    { value: "IL", label: "Israel" },
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

// Custom Dropdown Component with animated list
interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  "aria-label": string
  searchable?: boolean
}

function AnimatedDropdown({ value, onChange, options, placeholder, "aria-label": ariaLabel, searchable = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        if (searchable) setSearchTerm("")
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, searchable])

  // Filter options based on search term (only if searchable)
  const filteredOptions = searchable 
    ? options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options

  const selectedOption = options.find(opt => opt.value === value)

  const handleOpen = () => {
    setIsOpen(true)
    // Focus the input after the dropdown opens (only if searchable)
    if (searchable) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={handleOpen}
        className="h-10 w-full rounded-md appearance-none bg-primary text-foreground border px-3 text-sm shadow-sm focus:shadow-md focus:outline-none focus:ring-0 transition-shadow flex items-center justify-between"
      >
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#EFEDE3] border rounded-md shadow-lg max-h-60 animate-in fade-in-0 zoom-in-95 duration-200">
          {searchable && (
            <div className="p-2 border-b">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm bg-white border rounded focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
          )}
          <div className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                    if (searchable) setSearchTerm("")
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-primary/10 transition-colors"
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">{searchable ? "No countries found" : "No options available"}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const params = useParams()
  const lang = (params?.lang as string) || "en"
  // Use singleton Supabase client

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  // Date of birth as separate dropdowns
  const [dobYear, setDobYear] = useState<string>("")
  const [dobMonth, setDobMonth] = useState<string>("")
  const [dobDay, setDobDay] = useState<string>("")
  const [country, setCountry] = useState("")
  const [referral, setReferral] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    

    try {
      setLoading(true)
      // Build ISO date string from parts if all provided
      let dob: string | null = null
      if (dobYear && dobMonth && dobDay) {
        // Pad month/day
        const mm = String(dobMonth).padStart(2, "0")
        const dd = String(dobDay).padStart(2, "0")
        const iso = `${dobYear}-${mm}-${dd}`
        // Validate date
        const d = new Date(iso)
        if (!isNaN(d.getTime()) && d.toISOString().startsWith(`${dobYear}-${mm}-${dd}`)) {
          dob = iso
        } else {
          setError("Please select a valid date of birth")
          setLoading(false)
          return
        }
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/${lang}/login` : undefined,
          data: {
            first_name: firstName || null,
            last_name: lastName || null,
            dob: dob,
            country: country || null,
            referral: referral || null,
          },
        },
      })
      if (error) throw error

      setMessage("Check your email to confirm your account.")
      // Optionally navigate to login
      // router.push(`/${lang}/login`)
    } catch (err: any) {
      setError(err?.message || "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold">Create an account</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Already have an account? <Link className="underline" href={`/${lang}/login`}>Sign in</Link>
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <div className="grid grid-cols-3 gap-2">
                <AnimatedDropdown
                  aria-label="Month"
                  value={dobMonth}
                  onChange={setDobMonth}
                  placeholder="Month"
                  options={[
                    { value: "1", label: "Jan" },
                    { value: "2", label: "Feb" },
                    { value: "3", label: "Mar" },
                    { value: "4", label: "Apr" },
                    { value: "5", label: "May" },
                    { value: "6", label: "Jun" },
                    { value: "7", label: "Jul" },
                    { value: "8", label: "Aug" },
                    { value: "9", label: "Sep" },
                    { value: "10", label: "Oct" },
                    { value: "11", label: "Nov" },
                    { value: "12", label: "Dec" }
                  ]}
                />
                <AnimatedDropdown
                  aria-label="Day"
                  value={dobDay}
                  onChange={setDobDay}
                  placeholder="Day"
                  options={Array.from({ length: daysInMonth(Number(dobYear || 2000), Number(dobMonth || 1)) }, (_, i) => ({
                    value: (i + 1).toString(),
                    label: (i + 1).toString()
                  }))}
                />
                <AnimatedDropdown
                  aria-label="Year"
                  value={dobYear}
                  onChange={setDobYear}
                  placeholder="Year"
                  options={getYearOptions().map(y => ({
                    value: y.toString(),
                    label: y.toString()
                  }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <AnimatedDropdown
                aria-label="Country"
                value={country}
                onChange={setCountry}
                placeholder="Select your country"
                options={getCountryOptions()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referral">How did you hear about us?</Label>
              <Input id="referral" type="text" placeholder="Friend, Social Media, Google, ..." value={referral} onChange={(e) => setReferral(e.target.value)} />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {message && <div className="text-sm text-green-600">{message}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href={`/${lang}`} className="text-sm text-muted-foreground underline">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
