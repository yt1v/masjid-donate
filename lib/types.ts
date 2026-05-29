export type DonationSource = 'bkash' | 'nagad' | 'bank'

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
}
