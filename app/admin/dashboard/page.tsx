'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, LogOut, TrendingUp, TrendingDown, Wallet, Trash2, MessageSquare, Flag, Lightbulb } from 'lucide-react'
import { Donation, Expense, DonationSource, Feedback } from '@/lib/types'

function fmt(n: number) {
  return '৳ ' + n.toLocaleString('en-BD')
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function DashboardPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'donations' | 'expenses' | 'feedback'>('donations')
  const [donations, setDonations] = useState<Donation[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  // Donation form state
  const [dForm, setDForm] = useState({
    donor_name: '', is_anonymous: false, amount: '', source: 'bkash' as DonationSource,
    transaction_id: '', date: new Date().toISOString().split('T')[0], notes: '',
  })
  // Expense form state
  const [eForm, setEForm] = useState({
    category: '', amount: '', description: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    const [dr, er, fr] = await Promise.all([
      fetch('/api/donations').then((r) => r.json()),
      fetch('/api/expenses').then((r) => r.json()),
      fetch('/api/feedback').then((r) => r.json()),
    ])
    setDonations(dr.data ?? [])
    setExpenses(er.data ?? [])
    setFeedbacks(fr.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  async function submitDonation(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dForm, amount: parseFloat(dForm.amount) }),
    })
    if (res.ok) {
      setMsg('Donation recorded!')
      setDForm({ donor_name: '', is_anonymous: false, amount: '', source: 'bkash', transaction_id: '', date: new Date().toISOString().split('T')[0], notes: '' })
      loadData()
    } else {
      setMsg('Error saving donation.')
    }
    setSubmitting(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function submitExpense(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...eForm, amount: parseFloat(eForm.amount) }),
    })
    if (res.ok) {
      setMsg('Expense recorded!')
      setEForm({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] })
      loadData()
    } else {
      setMsg('Error saving expense.')
    }
    setSubmitting(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function deleteDonation(id: number) {
    if (!confirm('Delete this donation?')) return
    await fetch(`/api/donations?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  async function deleteExpense(id: number) {
    if (!confirm('Delete this expense?')) return
    await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  const totalIn = donations.reduce((s, x) => s + x.amount, 0)
  const totalOut = expenses.reduce((s, x) => s + x.amount, 0)
  const balance = totalIn - totalOut

  const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm'
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-green-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Sabdi Badher Par Jame Masjid</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-700 text-white rounded-xl p-4">
          <div className="flex items-center gap-1 text-xs opacity-75 mb-1"><TrendingUp size={14} /> Received</div>
          <p className="text-xl font-bold">{fmt(totalIn)}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <div className="flex items-center gap-1 text-xs text-red-500 mb-1"><TrendingDown size={14} /> Spent</div>
          <p className="text-xl font-bold text-red-700">{fmt(totalOut)}</p>
        </div>
        <div className={`rounded-xl p-4 border ${balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <div className={`flex items-center gap-1 text-xs mb-1 ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}><Wallet size={14} /> Balance</div>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{fmt(balance)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('donations')} className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${tab === 'donations' ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          Donations ({donations.length})
        </button>
        <button onClick={() => setTab('expenses')} className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${tab === 'expenses' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          Expenses ({expenses.length})
        </button>
        <button onClick={() => setTab('feedback')} className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${tab === 'feedback' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          Feedback ({feedbacks.length})
        </button>
      </div>

      {msg && (
        <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">{msg}</div>
      )}

      {tab === 'donations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Donation form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-green-900 mb-4 flex items-center gap-2"><PlusCircle size={18} /> Record Donation</h2>
            <form onSubmit={submitDonation} className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="anon" checked={dForm.is_anonymous} onChange={(e) => setDForm({ ...dForm, is_anonymous: e.target.checked })} className="rounded" />
                <label htmlFor="anon" className="text-sm text-gray-600">Anonymous donor</label>
              </div>
              {!dForm.is_anonymous && (
                <div>
                  <label className={labelCls}>Donor Name</label>
                  <input value={dForm.donor_name} onChange={(e) => setDForm({ ...dForm, donor_name: e.target.value })} placeholder="Full name" className={inputCls} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Amount (৳)</label>
                  <input type="number" required min="1" value={dForm.amount} onChange={(e) => setDForm({ ...dForm, amount: e.target.value })} placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Source</label>
                  <select value={dForm.source} onChange={(e) => setDForm({ ...dForm, source: e.target.value as DonationSource })} className={inputCls}>
                    <option value="bkash">Bkash</option>
                    <option value="nagad">Nagad</option>
                    <option value="bank">Bank</option>
                    <option value="cash">Cash</option>
                    <option value="friday_collection">Friday Collection</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Transaction ID (optional)</label>
                <input value={dForm.transaction_id} onChange={(e) => setDForm({ ...dForm, transaction_id: e.target.value })} placeholder="TXN ID" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" required value={dForm.date} onChange={(e) => setDForm({ ...dForm, date: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Notes (optional)</label>
                <input value={dForm.notes} onChange={(e) => setDForm({ ...dForm, notes: e.target.value })} placeholder="Any note..." className={inputCls} />
              </div>
              <button type="submit" disabled={submitting} className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl disabled:opacity-60">
                {submitting ? 'Saving...' : 'Save Donation'}
              </button>
            </form>
          </div>

          {/* Donation list */}
          <div>
            <h2 className="font-bold text-green-900 mb-4">Recent Donations</h2>
            {loading ? <p className="text-gray-400 text-sm">Loading...</p> : donations.length === 0 ? (
              <p className="text-gray-400 text-sm">No donations yet.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {donations.map((d) => (
                  <div key={d.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-start justify-between shadow-sm">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {d.is_anonymous ? '— Anonymous' : d.donor_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{d.source === 'friday_collection' ? 'Friday Collection' : d.source} · {fmtDate(d.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-700 text-sm">{fmt(d.amount)}</span>
                      <button onClick={() => deleteDonation(d.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Expense form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-red-800 mb-4 flex items-center gap-2"><PlusCircle size={18} /> Record Expense</h2>
            <form onSubmit={submitExpense} className="space-y-3">
              <div>
                <label className={labelCls}>Category</label>
                <input required value={eForm.category} onChange={(e) => setEForm({ ...eForm, category: e.target.value })} placeholder="e.g. Electricity Bill, Renovation..." className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Amount (৳)</label>
                  <input type="number" required min="1" value={eForm.amount} onChange={(e) => setEForm({ ...eForm, amount: e.target.value })} placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" required value={eForm.date} onChange={(e) => setEForm({ ...eForm, date: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Description (optional)</label>
                <textarea value={eForm.description} onChange={(e) => setEForm({ ...eForm, description: e.target.value })} placeholder="Details about this expense..." className={`${inputCls} resize-none h-20`} />
              </div>
              <button type="submit" disabled={submitting} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl disabled:opacity-60">
                {submitting ? 'Saving...' : 'Save Expense'}
              </button>
            </form>
          </div>

          {/* Expense list */}
          <div>
            <h2 className="font-bold text-red-800 mb-4">Recent Expenses</h2>
            {loading ? <p className="text-gray-400 text-sm">Loading...</p> : expenses.length === 0 ? (
              <p className="text-gray-400 text-sm">No expenses yet.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {expenses.map((e) => (
                  <div key={e.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-start justify-between shadow-sm">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{e.category}</p>
                      {e.description && <p className="text-xs text-gray-500">{e.description}</p>}
                      <p className="text-xs text-gray-400">{fmtDate(e.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-600 text-sm">{fmt(e.amount)}</span>
                      <button onClick={() => deleteExpense(e.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'feedback' && (
        <div>
          <h2 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
            <MessageSquare size={18} /> Community Feedback
          </h2>
          {loading ? <p className="text-gray-400 text-sm">Loading...</p> : feedbacks.length === 0 ? (
            <p className="text-gray-400 text-sm">No feedback submitted yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feedbacks.map((f) => (
                <div key={f.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        f.type === 'report' ? 'bg-red-100 text-red-700' :
                        f.type === 'suggestion' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {f.type === 'report' ? <Flag size={11} /> : f.type === 'suggestion' ? <Lightbulb size={11} /> : <MessageSquare size={11} />}
                        {f.type.charAt(0).toUpperCase() + f.type.slice(1)}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(f.created_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{f.name || 'Anonymous'}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{f.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
