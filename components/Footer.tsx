import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" showText={false} />
          <div className="text-center">
            <p className="font-semibold text-white">Sabdi Badher Par Jame Masjid</p>
            <p className="text-sm text-green-300 mt-1">সাব্দী বাঁধের পাড় জামে মসজিদ</p>
          </div>
          <p className="text-xs text-green-400 text-center md:text-right">
            All donations are used solely<br />for the masjid&apos;s welfare.
          </p>
        </div>
        <div className="mt-6 pt-4 border-t border-green-800 text-center text-xs text-green-500">
          © {new Date().getFullYear()} Sabdi Badher Par Jame Masjid. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
