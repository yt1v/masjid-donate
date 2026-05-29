export type DonationSource = 'bkash' | 'nagad' | 'bank' | 'cash' | 'friday_collection'

export interface Donation {
  id: number
  donor_name: string | null
  is_anonymous: boolean
  amount: number
  source: DonationSource
  transaction_id: string | null
  date: string
  notes: string | null
}

export interface Expense {
  id: number
  category: string
  amount: number
  description: string | null
  date: string
}

export interface DonationSummary {
  total: number
  bkash: number
  nagad: number
  bank: number
  cash: number
  friday_collection: number
}

export type FeedbackType = 'comment' | 'report' | 'suggestion'

export interface Feedback {
  id: number
  name: string | null
  message: string
  type: FeedbackType
  created_at: string
}
