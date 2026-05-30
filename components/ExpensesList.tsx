'use client'
import { useState } from 'react'
import { Expense } from '@/lib/types'

function fmt(n: number) {
  return '৳ ' + n.toLocaleString('en-BD')
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function ExpensesList({ expenses }: { expenses: Expense[] }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? expenses : expenses.slice(0, 6)

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
        No expenses recorded yet.
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-3">
        {visible.map((e) => (
          <div key={e.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{e.category}</p>
                {e.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{e.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{fmtDate(e.date)}</p>
              </div>
              <p className="font-bold text-red-600">{fmt(e.amount)}</p>
            </div>
          </div>
        ))}
      </div>

      {expenses.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          {showAll ? 'Show Less' : `See More (${expenses.length - 6} more)`}
        </button>
      )}
    </div>
  )
}
