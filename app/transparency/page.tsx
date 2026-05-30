import { getSupabase } from '@/lib/supabase'
import { Donation, Expense, DonationSummary } from '@/lib/types'
import { TrendingUp, TrendingDown, Wallet, Smartphone, Building2, User, EyeOff, AlertCircle, Banknote, Star } from 'lucide-react'
import ExpensesList from '@/components/ExpensesList'

export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const supabase = getSupabase()
    const [donationsRes, expensesRes] = await Promise.all([
      supabase.from('donations').select('*').order('date', { ascending: false }),
      supabase.from('expenses').select('*').order('date', { ascending: false }),
    ])

    const d = (donationsRes.data ?? []) as Donation[]
    const e = (expensesRes.data ?? []) as Expense[]

    const summary: DonationSummary = {
      total: d.reduce((s, x) => s + x.amount, 0),
      bkash: d.filter((x) => x.source === 'bkash').reduce((s, x) => s + x.amount, 0),
      nagad: d.filter((x) => x.source === 'nagad').reduce((s, x) => s + x.amount, 0),
      bank: d.filter((x) => x.source === 'bank').reduce((s, x) => s + x.amount, 0),
      cash: d.filter((x) => x.source === 'cash').reduce((s, x) => s + x.amount, 0),
      friday_collection: d.filter((x) => x.source === 'friday_collection').reduce((s, x) => s + x.amount, 0),
    }
    const totalExpenses = e.reduce((s, x) => s + x.amount, 0)
    const balance = summary.total - totalExpenses

    return { donations: d, expenses: e, summary, totalExpenses, balance, error: null }
  } catch {
    return {
      donations: [] as Donation[],
      expenses: [] as Expense[],
      summary: { total: 0, bkash: 0, nagad: 0, bank: 0, cash: 0, friday_collection: 0 },
      totalExpenses: 0,
      balance: 0,
      error: 'Database not configured. Please set up Supabase environment variables.',
    }
  }
}

function fmt(n: number) {
  return '৳ ' + n.toLocaleString('en-BD')
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default async function TransparencyPage() {
  const { donations, expenses, summary, totalExpenses, balance, error } = await getData()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-green-900">Financial Transparency</h1>
        <p className="text-gray-500 mt-2">Complete record of all donations received and expenses made</p>
      </div>

      {error && (
        <div className="mb-8 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Setup Required</p>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-green-700 text-white rounded-2xl p-5 shadow">
          <div className="flex items-center gap-2 mb-1 opacity-80 text-sm">
            <TrendingUp size={16} /> Total Received
          </div>
          <p className="text-3xl font-bold">{fmt(summary.total)}</p>
          <div className="mt-3 space-y-1 text-xs opacity-80">
            <div className="flex justify-between"><span className="flex items-center gap-1"><Smartphone size={12} /> Bkash</span><span>{fmt(summary.bkash)}</span></div>
            <div className="flex justify-between"><span className="flex items-center gap-1"><Smartphone size={12} /> Nagad</span><span>{fmt(summary.nagad)}</span></div>
            <div className="flex justify-between"><span className="flex items-center gap-1"><Building2 size={12} /> Bank</span><span>{fmt(summary.bank)}</span></div>
            <div className="flex justify-between"><span className="flex items-center gap-1"><Banknote size={12} /> Cash</span><span>{fmt(summary.cash)}</span></div>
            <div className="flex justify-between"><span className="flex items-center gap-1"><Star size={12} /> Friday</span><span>{fmt(summary.friday_collection)}</span></div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-red-600 text-sm">
            <TrendingDown size={16} /> Total Spent
          </div>
          <p className="text-3xl font-bold text-red-700">{fmt(totalExpenses)}</p>
          <p className="text-xs text-red-400 mt-2">{expenses.length} expense records</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm border ${balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <div className={`flex items-center gap-2 mb-1 text-sm ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            <Wallet size={16} /> Current Balance
          </div>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{fmt(balance)}</p>
          <p className={`text-xs mt-2 ${balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
            {balance >= 0 ? 'Funds available' : 'Deficit'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donations */}
        <div>
          <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" /> Donations Received
          </h2>
          {donations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
              No donations recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((d) => (
                <div key={d.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      d.source === 'bkash' ? 'bg-pink-500' :
                      d.source === 'nagad' ? 'bg-orange-500' :
                      d.source === 'bank' ? 'bg-blue-500' :
                      d.source === 'friday_collection' ? 'bg-green-600' :
                      'bg-gray-500'
                    }`}>
                      {d.source === 'bkash' ? 'B' : d.source === 'nagad' ? 'N' : d.source === 'bank' ? 'BK' : d.source === 'friday_collection' ? 'জু' : 'C'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm flex items-center gap-1">
                        {d.is_anonymous ? (
                          <span className="flex items-center gap-1 text-gray-400 italic"><EyeOff size={12} /> Anonymous</span>
                        ) : (
                          <span className="flex items-center gap-1"><User size={12} /> {d.donor_name || 'Unknown'}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{d.source === 'friday_collection' ? 'Friday Collection' : d.source} · {fmtDate(d.date)}</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-700">{fmt(d.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expenses */}
        <div>
          <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
            <TrendingDown size={20} className="text-red-500" /> Expenses
          </h2>
          <ExpensesList expenses={expenses} />
        </div>
      </div>
    </div>
  )
}
