'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

const links = [
  { href: '/', label: 'Home' },
  { href: '/donate', label: 'Donate' },
  { href: '/transparency', label: 'Transparency' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/donate"
            className="ml-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Donate Now
          </Link>
        </div>
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-green-50"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1 border-t border-green-50">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/donate"
            onClick={() => setOpen(false)}
            className="mt-1 px-4 py-3 bg-yellow-500 text-white font-semibold rounded-lg text-sm text-center"
          >
            Donate Now
          </Link>
        </div>
      )}
    </nav>
  )
}
