"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

type LoginForm = {
  email: string
  password: string
}

type LoginErrors = Partial<Record<keyof LoginForm, string>>

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateLoginForm(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {}

  if (!form.email.trim()) {
    errors.email = "Email is required."
  } else if (!validateEmail(form.email)) {
    errors.email = "Enter a valid email address."
  }

  if (!form.password) {
    errors.password = "Password is required."
  }

  return errors
}

function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  rightElement,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  rightElement?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-cocoa">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-cream px-4 py-3 text-sm text-cocoa placeholder:text-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
            rightElement ? "pr-12" : ""
          } ${error ? "border-rose bg-rose/5" : "border-border"}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/3">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-rose"
        >
          <AlertCircle
            strokeWidth={1.5}
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          {error}
        </p>
      )}
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function updateField(field: keyof LoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitted) {
      const updated = { ...form, [field]: value }
      const newErrors = validateLoginForm(updated)
      setErrors(newErrors)
    }
    if (authError) setAuthError("")
  }

  async function handleSubmit() {
    setSubmitted(true)
    const newErrors = validateLoginForm(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setIsLoading(false)

    if (result?.error) {
      setAuthError("Invalid email or password. Please try again.")
      return
    }

    // Refresh session first so Next.js picks up the new auth state
    router.refresh()
    router.push("/account")
  }

  return (
    <div className="flex min-h-screen">

      {/* Left — Image panel */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/bloom-hero.jpg"
          alt="Bloom Bakery fresh baked goods"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-cocoa/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <Link
            href="/"
            className="font-display text-4xl font-semibold text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream rounded-sm"
          >
            Bloom Bakery
          </Link>
          <p className="mt-3 text-sm text-cream/80">
            Freshly baked with love in Karachi
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-2.5 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm"
          >
            <Image
              src="/icon.svg"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-display text-2xl font-semibold text-cocoa">
              Bloom Bakery
            </span>
          </Link>

          <h1 className="font-display text-3xl text-cocoa">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to your account to continue.
          </p>

          {/* Auth error */}
          {authError && (
            <div
              role="alert"
              className="mt-6 flex items-center gap-2.5 rounded-xl border border-rose/30 bg-rose/5 px-4 py-3 text-sm text-rose"
            >
              <AlertCircle
                strokeWidth={1.5}
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              {authError}
            </div>
          )}

          {/* Form */}
          <div className="mt-8 flex flex-col gap-5">
            <InputField
              id="email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(v) => updateField("email", v)}
              placeholder="ayesha@example.com"
              error={errors.email}
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(v) => updateField("password", v)}
              placeholder="Enter your password"
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted hover:text-rose transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm"
                >
                  {showPassword ? (
                    <EyeOff strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              }
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rose text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-rose hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}