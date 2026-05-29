'use client'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { MessageSquare, Flag, Lightbulb, Send, CheckCircle } from 'lucide-react'
import { FeedbackType } from '@/lib/types'

const types: { id: FeedbackType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'comment', label: 'Comment', icon: <MessageSquare size={18} />, desc: 'Share your thoughts about our work' },
  { id: 'suggestion', label: 'Suggestion', icon: <Lightbulb size={18} />, desc: 'Suggest an improvement or idea' },
  { id: 'report', label: 'Report', icon: <Flag size={18} />, desc: 'Report a concern or issue' },
]

export default function FeedbackPage() {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [type, setType] = useState<FeedbackType>('comment')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const token = recaptchaRef.current?.getValue()
    if (!token) {
      setError('Please complete the reCAPTCHA verification.')
      return
    }

    setSubmitting(true)
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() || null, message, type, recaptchaToken: token }),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong. Please try again.')
      recaptchaRef.current?.reset()
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900">Thank You!</h2>
          <p className="text-gray-500 mt-2">Your {type} has been submitted. We appreciate your feedback.</p>
          <button
            onClick={() => { setSubmitted(false); setMessage(''); setName(''); recaptchaRef.current?.reset() }}
            className="mt-6 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-green-900">Feedback & Reports</h1>
        <p className="text-gray-500 mt-2">Share your comments, suggestions, or report any concerns</p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              type === t.id
                ? t.id === 'report'
                  ? 'border-red-400 bg-red-50'
                  : t.id === 'suggestion'
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-green-400 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`mb-1 ${type === t.id ? t.id === 'report' ? 'text-red-600' : t.id === 'suggestion' ? 'text-yellow-600' : 'text-green-700' : 'text-gray-400'}`}>
              {t.icon}
            </div>
            <p className={`font-semibold text-sm ${type === t.id ? 'text-gray-900' : 'text-gray-600'}`}>{t.label}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-tight hidden sm:block">{t.desc}</p>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Your {type === 'comment' ? 'Comment' : type === 'suggestion' ? 'Suggestion' : 'Report'} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              type === 'comment'
                ? 'Write your thoughts about our masjid or work...'
                : type === 'suggestion'
                ? 'Share your idea or suggestion for improvement...'
                : 'Describe the issue or concern you want to report...'
            }
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{message.length}/500 characters</p>
        </div>

        <div>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || message.length === 0 || message.length > 500}
          className={`w-full py-3 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 text-white ${
            type === 'report' ? 'bg-red-600 hover:bg-red-700' :
            type === 'suggestion' ? 'bg-yellow-500 hover:bg-yellow-600' :
            'bg-green-700 hover:bg-green-800'
          }`}
        >
          <Send size={16} />
          {submitting ? 'Submitting...' : `Submit ${type === 'comment' ? 'Comment' : type === 'suggestion' ? 'Suggestion' : 'Report'}`}
        </button>
      </form>
    </div>
  )
}
