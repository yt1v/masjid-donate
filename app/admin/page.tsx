'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReCAPTCHA from 'react-google-recaptcha'
import Logo from '@/components/Logo'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const token = recaptchaRef.current?.getValue()
    if (!token) {
      setError('Please complete the reCAPTCHA verification.')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, recaptchaToken: token }),
    })
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      const data = await res.json()
      setError(data.error || 'Incorrect password. Please try again.')
      recaptchaRef.current?.reset()
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" showText={false} />
          <h1 className="mt-4 text-xl font-bold text-green-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Masjid Fund Management</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          />
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
