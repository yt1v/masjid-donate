'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Smartphone, Building2, CreditCard } from 'lucide-react'

interface PaymentMethod {
  id: string
  name: string
  color: string
  bgColor: string
  borderColor: string
  icon: React.ReactNode
  number?: string
  accountName?: string
  bankName?: string
  accountNumber?: string
  branchName?: string
  routingNumber?: string
  instructions: string[]
}

const methods: PaymentMethod[] = [
  {
    id: 'bkash',
    name: 'Bkash',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    icon: <Smartphone className="text-pink-600" size={24} />,
    number: '01XXXXXXXXX',
    accountName: 'Masjid Fund',
    instructions: [
      'Open your Bkash app',
      'Tap "Send Money"',
      'Enter the number above',
      'Enter the amount',
      'Use reference: "Masjid Donation"',
      'Confirm with your PIN',
    ],
  },
  {
    id: 'nagad',
    name: 'Nagad',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: <Smartphone className="text-orange-500" size={24} />,
    number: '01XXXXXXXXX',
    accountName: 'Masjid Fund',
    instructions: [
      'Open your Nagad app',
      'Tap "Send Money"',
      'Enter the number above',
      'Enter the amount',
      'Use reference: "Masjid Donation"',
      'Confirm with your PIN',
    ],
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: <Building2 className="text-blue-600" size={24} />,
    accountName: 'Sabdi Badher Par Jame Masjid',
    bankName: 'Bank Name',
    accountNumber: 'XXXX-XXXX-XXXX',
    branchName: 'Branch Name',
    routingNumber: 'XXXXXXX',
    instructions: [
      'Visit your bank or use mobile banking',
      'Select "Fund Transfer"',
      'Enter the account details above',
      'Enter your donation amount',
      'Use reference: "Masjid Donation"',
      'Complete the transaction',
    ],
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 rounded-md hover:bg-black/10 transition-colors text-gray-500"
      title="Copy"
    >
      {copied ? <CheckCheck size={16} className="text-green-600" /> : <Copy size={16} />}
    </button>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-dashed border-gray-200 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex items-center font-semibold text-gray-800">
        {value}
        <CopyButton text={value} />
      </div>
    </div>
  )
}

export default function DonatePage() {
  const [active, setActive] = useState('bkash')
  const method = methods.find((m) => m.id === active)!

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-green-900">Make a Donation</h1>
        <p className="text-gray-500 mt-2">
          Choose your preferred payment method below
        </p>
      </div>

      {/* Method tabs */}
      <div className="flex gap-2 mb-6 justify-center flex-wrap">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
              active === m.id
                ? `${m.bgColor} ${m.borderColor} ${m.color} shadow-sm`
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Payment card */}
      <div className={`rounded-2xl border-2 ${method.borderColor} ${method.bgColor} p-6 md:p-8`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            {method.icon}
          </div>
          <h2 className={`text-xl font-bold ${method.color}`}>{method.name}</h2>
        </div>

        {/* Account details */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          {method.number && <InfoRow label="Number" value={method.number} />}
          {method.accountName && <InfoRow label="Account Name" value={method.accountName} />}
          {method.bankName && <InfoRow label="Bank" value={method.bankName} />}
          {method.accountNumber && <InfoRow label="Account No." value={method.accountNumber} />}
          {method.branchName && <InfoRow label="Branch" value={method.branchName} />}
          {method.routingNumber && <InfoRow label="Routing No." value={method.routingNumber} />}
        </div>

        {/* Instructions */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CreditCard size={16} />
            How to donate
          </h3>
          <ol className="space-y-2">
            {method.instructions.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 ${method.id === 'bkash' ? 'bg-pink-500' : method.id === 'nagad' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        After donating, please inform the masjid admin with your transaction ID so we can record your donation.
      </p>
    </div>
  )
}
