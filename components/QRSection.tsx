'use client'
import { useRef } from 'react'
import QRCode from 'react-qr-code'
import { Download } from 'lucide-react'

const methods = [
  {
    id: 'bkash',
    name: 'Bkash',
    number: '01738052858',
    value: '01738052858',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    badge: 'bg-pink-600',
    fgColor: '#9d174d',
  },
  {
    id: 'nagad',
    name: 'Nagad',
    number: '01738052858',
    value: '01738052858',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-500',
    fgColor: '#c2410c',
  },
]

function QRCard({ method }: { method: typeof methods[0] }) {
  const svgRef = useRef<HTMLDivElement>(null)

  function downloadQR() {
    const svg = svgRef.current?.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')!
    const img = new window.Image()
    img.onload = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 300, 300)
      ctx.drawImage(img, 0, 0, 300, 300)
      const a = document.createElement('a')
      a.download = `${method.name.toLowerCase()}-qr.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className={`flex flex-col items-center p-6 rounded-2xl border-2 ${method.bg} ${method.border} shadow-sm`}>
      <span className={`${method.badge} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}>
        {method.name}
      </span>
      <div ref={svgRef} className="bg-white p-3 rounded-xl shadow-inner">
        <QRCode
          value={method.value}
          size={160}
          fgColor={method.fgColor}
          bgColor="#ffffff"
          level="M"
        />
      </div>
      <p className="mt-3 font-semibold text-gray-800 text-sm tracking-wide">{method.number}</p>
      <p className="text-xs text-gray-500 mt-0.5">Scan with {method.name} app</p>
      <button
        onClick={downloadQR}
        className="mt-4 flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Download size={13} /> Download QR
      </button>
    </div>
  )
}

export default function QRSection() {
  return (
    <section className="py-12 px-4 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-green-900">Scan to Donate</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Open your Bkash or Nagad app → Scan QR → Enter amount → Send
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 max-w-sm mx-auto">
          {methods.map((m) => <QRCard key={m.id} method={m} />)}
        </div>
      </div>
    </section>
  )
}
