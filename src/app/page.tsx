import Link from 'next/link';
import { menuItems } from '@/lib/menu-data';

export default function Home() {
  const favoriteMenu = menuItems.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&h=1080&fit=crop)',
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-cream mb-6">
            Kopi Kita
          </h1>
          <p className="text-xl md:text-2xl text-cream/90 mb-8 max-w-2xl mx-auto">
            Coffee for Everyone
          </p>
          <Link
            href="/menu"
            className="inline-block bg-cream text-dark-brown px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors"
          >
            Lihat Menu
          </Link>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold text-dark-brown mb-6">STORY</h2>
              <p className="text-lg text-dark-brown/80 leading-relaxed mb-6">
                Didirikan pada April 2017 oleh dua anak muda dari Yogyakarta, Kopi Kita
                hadir dari ide sederhana bahwa setiap orang berhak menikmati kopi
                berkualitas. Tidak masalah jika Anda menyukai kopi ringan dan manis,
                atau preferensi strong tanpa gula, kami siap memenuhi selera Anda.
              </p>
              <p className="text-lg text-dark-brown/80 leading-relaxed mb-6">
                Semuanya berawal dari bangunan kecil sewaan di Jalan Kaliurang. Kini,
                Kopi Kita telah hadir di berbagai lokasi untuk menemani hari-hari Anda.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-light-brown font-semibold hover:text-dark-brown transition-colors"
              >
                <span>FULL STORY</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 12.285 7.02">
                  <path d="M8.529,128.1l-.194.194a.329.329,0,0,0,0,.465l2.3,2.288H.329a.329.329,0,0,0-.329.329v.274a.329.329,0,0,0,.329.329H10.636l-2.3,2.288a.329.329,0,0,0,0,.465l.194.194a.329.329,0,0,0,.465,0l3.194-3.181a.329.329,0,0,0,0-.465L8.994,128.1A.329.329,0,0,0,8.529,128.1Z" transform="translate(0 -128)" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop"
                alt="Kopi Kita Story"
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent w-32 h-32 rounded-lg -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Favorite Menu Section */}
      <section className="py-20 bg-dark-brown">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-cream text-center mb-4">
            FAVORITE MENU
          </h2>
          <p className="text-cream/80 text-center mb-12 max-w-xl mx-auto">
            Menu favorit pilihan pelanggan setia Kopi Kita
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteMenu.map((item) => (
              <div
                key={item.id}
                className="bg-cream rounded-lg overflow-hidden shadow-lg group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-dark-brown/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-cream text-center px-4 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-dark-brown mb-2">{item.name}</h3>
                  <p className="text-light-brown font-medium">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="inline-block bg-cream text-dark-brown px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors"
            >
              Lihat Semua Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Location */}
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-dark-brown" fill="currentColor" viewBox="0 0 12 15.372">
                  <path d="M5.383,15.062C.843,8.738,0,8.089,0,5.765A5.886,5.886,0,0,1,6,0a5.886,5.886,0,0,1,6,5.765c0,2.324-.843,2.973-5.383,9.3A.768.768,0,0,1,5.383,15.062ZM6,8.167a2.452,2.452,0,0,0,2.5-2.4A2.452,2.452,0,0,0,6,3.363a2.452,2.452,0,0,0-2.5,2.4A2.452,2.452,0,0,0,6,8.167Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-brown mb-3">Lokasi</h3>
              <p className="text-dark-brown/70">
                Jl. Kaliurang Km 5
                <br />
                Yogyakarta 55283
              </p>
            </div>

            {/* Hours */}
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-dark-brown" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM20.586 23.414l-6.586-6.586v-8.828h4v7.172l5.414 5.414-2.829 2.829z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-brown mb-3">Jam Buka</h3>
              <p className="text-dark-brown/70">
                Senin - Minggu
                <br />
                08:00 - 22:00 WIB
              </p>
            </div>

            {/* Contact */}
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="text-xl font-bold text-dark-brown mb-3">Kontak</h3>
              <p className="text-dark-brown/70">
                +62 812 3456 7890
                <br />
                hello@kopikita.id
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-brown mb-6">
            Ingin Reservasi Tempat?
          </h2>
          <p className="text-dark-brown/80 mb-8 max-w-xl mx-auto">
            Pesan tempat Anda untuk meeting, gathering, atau sekadar nongkrong
            bersama teman-teman.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-dark-brown text-cream px-8 py-3 rounded-full font-semibold hover:bg-light-brown transition-colors"
          >
            Booking Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
