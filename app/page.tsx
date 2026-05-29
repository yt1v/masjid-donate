import Link from 'next/link'
import { Heart, Eye, HandCoins } from 'lucide-react'
import Logo from '@/components/Logo'
import MasjidSlider from '@/components/MasjidSlider'
import QRSection from '@/components/QRSection'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-green-950 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Sabdi Badher Par<br />
            <span className="text-yellow-400">Jame Masjid</span>
          </h1>
          <p className="text-green-200 mt-2 text-lg">সাব্দী বাঁধের পাড় জামে মসজিদ</p>
          <p className="mt-6 text-green-100 text-lg max-w-xl mx-auto leading-relaxed">
            Your donations help maintain and grow our masjid. Every contribution —
            big or small — makes a difference for our community.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/donate"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
            >
              Donate Now
            </Link>
            <Link
              href="/transparency"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-lg transition-colors border border-white/20"
            >
              View Transparency
            </Link>
          </div>
        </div>
      </section>

      {/* Masjid Photo Slider */}
      <MasjidSlider />

      {/* QR Codes */}
      <QRSection />

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-green-50 border border-green-100">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HandCoins className="text-green-700" size={28} />
            </div>
            <h3 className="font-bold text-green-900 text-lg">Easy Donation</h3>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Send via Bkash, Nagad, or direct bank transfer. Quick and simple for everyone.
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-yellow-50 border border-yellow-100">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="text-yellow-700" size={28} />
            </div>
            <h3 className="font-bold text-yellow-900 text-lg">Full Transparency</h3>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Every taka received and spent is recorded and displayed publicly for the community.
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-green-50 border border-green-100">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-green-700" size={28} />
            </div>
            <h3 className="font-bold text-green-900 text-lg">Community First</h3>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              100% of donations go directly to masjid maintenance, education, and community programs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-green-50 border-t border-green-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-green-800 font-semibold text-lg">
            &quot;The Prophet ﷺ said: Whoever builds a masjid for Allah, Allah will build for him a house in Paradise.&quot;
          </p>
          <p className="text-green-600 text-sm mt-1">— Sahih Bukhari & Muslim</p>
          <Link
            href="/donate"
            className="mt-6 inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition-colors"
          >
            Donate Today
          </Link>
        </div>
      </section>
    </div>
  )
}
