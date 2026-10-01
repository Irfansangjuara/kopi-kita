import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-brown text-cream py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Kopi Kita</h3>
            <p className="text-cream/80 leading-relaxed">
              Kopi Kita hadir dari ide sederhana bahwa setiap orang berhak menikmati kopi
              berkualitas. Baik Anda menyukai kopi ringan dan manis, atau preferensi strong
              tanpa gula, kami siap memenuhi selera Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-cream/80 hover:text-accent transition-colors">
                Home
              </Link>
              <Link href="/menu" className="text-cream/80 hover:text-accent transition-colors">
                Menu
              </Link>
              <Link href="/booking" className="text-cream/80 hover:text-accent transition-colors">
                Booking
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-cream/80">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 12 15.372">
                  <path d="M5.383,15.062C.843,8.738,0,8.089,0,5.765A5.886,5.886,0,0,1,6,0a5.886,5.886,0,0,1,6,5.765c0,2.324-.843,2.973-5.383,9.3A.768.768,0,0,1,5.383,15.062ZM6,8.167a2.452,2.452,0,0,0,2.5-2.4A2.452,2.452,0,0,0,6,3.363a2.452,2.452,0,0,0-2.5,2.4A2.452,2.452,0,0,0,6,8.167Z" />
                </svg>
                <span>Jl. Kaliurang Km 5, Yogyakarta</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM20.586 23.414l-6.586-6.586v-8.828h4v7.172l5.414 5.414-2.829 2.829z" />
                </svg>
                <span>08:00 - 22:00 (Setiap Hari)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📱</span>
                <span>+62 812 3456 7890</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-8 pt-8 text-center text-cream/60">
          <p>© {new Date().getFullYear()} Kopi Kita. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
