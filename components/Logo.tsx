import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const dimensions = { sm: 36, md: 48, lg: 72 }
  const d = dimensions[size]

  return (
    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
      <svg
        width={d}
        height={d}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Masjid Logo"
      >
        <circle cx="32" cy="32" r="32" fill="#0d6c38" />
        <ellipse cx="32" cy="28" rx="14" ry="10" fill="#ffffff" />
        <rect x="18" y="28" width="28" height="16" fill="#ffffff" />
        <path d="M27 44 Q27 36 32 36 Q37 36 37 44Z" fill="#0d6c38" />
        <rect x="13" y="22" width="5" height="22" rx="1" fill="#ffffff" />
        <path d="M13 22 Q15.5 16 18 22Z" fill="#c9a227" />
        <rect x="46" y="22" width="5" height="22" rx="1" fill="#ffffff" />
        <path d="M46 22 Q48.5 16 51 22Z" fill="#c9a227" />
        <rect x="30.5" y="14" width="3" height="14" fill="#ffffff" />
        <path d="M30 14 Q32 8 34 14Z" fill="#c9a227" />
        <path d="M44 10 A6 6 0 1 1 44 22 A4 4 0 1 0 44 10Z" fill="#c9a227" />
        <polygon
          points="54,10 55,13 58,13 55.5,15 56.5,18 54,16 51.5,18 52.5,15 50,13 53,13"
          fill="#c9a227"
        />
        <rect x="10" y="44" width="44" height="2" rx="1" fill="#c9a227" />
      </svg>
      {showText && (
        <div className="leading-tight">
          <p className="text-xs font-medium text-green-700">সাব্দী বাঁধের পাড় জামে</p>
          <p className="font-bold text-green-900 text-sm md:text-base">মসজিদ ফান্ড</p>
        </div>
      )}
    </Link>
  )
}
