import Link from 'next/link';
import { menuItems } from '@/lib/menu-data';

export default function Home() {
  const favoriteMenu = menuItems.filter(item => item.available).slice(0, 6);

  return (
    <>
      {/* Hero Section - Couvee Style */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&h=1080&fit=crop)',
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        
        {/* Hero Text */}
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold text-cream mb-4 tracking-wider">
            KOPI KITA
          </h1>
          <p className="text-xl md:text-2xl text-cream/90 tracking-widest">
            COFFEE FOR EVERYONE
          </p>
        </div>
      </section>

      {/* Story Section - Couvee Style */}
      <section id="story" className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="animate-slide-in-right">
              <h2 className="section-title text-dark-brown">STORY</h2>
              <p className="text-lg text-dark-brown/80 leading-relaxed mb-6">
                Didirikan pada April 2017 oleh dua anak muda dari Yogyakarta, Kopi Kita
                hadir dari ide sederhana bahwa setiap orang berhak menikmati kopi
                berkualitas. Tidak masalah jika Anda menyukai kopi ringan dan manis,
                atau preferensi strong tanpa gula, kami siap memenuhi selera Anda.
              </p>
              <p className="text-lg text-dark-brown/80 leading-relaxed mb-8">
                Semuanya berawal dari bangunan kecil sewaan di Jalan Kaliurang. Kini,
                Kopi Kita telah hadir di berbagai lokasi untuk menemani hari-hari Anda.
              </p>
              <Link href="/menu" className="btn-primary">
                <span>FULL STORY</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 12.285 7.02">
                  <path d="M8.529,128.1l-.194.194a.329.329,0,0,0,0,.465l2.3,2.288H.329a.329.329,0,0,0-.329.329v.274a.329.329,0,0,0,.329.329H10.636l-2.3,2.288a.329.329,0,0,0,0,.465l.194.194a.329.329,0,0,0,.465,0l3.194-3.181a.329.329,0,0,0,0-.465L8.994,128.1A.329.329,0,0,0,8.529,128.1Z" transform="translate(0 -128)" />
                </svg>
              </Link>
            </div>
            
            {/* Image */}
            <div className="relative animate-slide-in-left">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=800&fit=crop"
                alt="Kopi Kita Story"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Couvee Style */}
      <section className="py-24 bg-dark-brown">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-cream text-center">PRODUCTS</h2>
          
          {/* Product Carousel/Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {favoriteMenu.map((item, index) => (
              <div
                key={item.id}
                className={`product-card bg-cream rounded-lg overflow-hidden shadow-lg ${index === 0 ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-square">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="thumb-overlay">
                    <span>+</span>
                    <h3>See Description</h3>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-dark-brown text-lg">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/menu" className="btn-outline border-cream text-cream hover:bg-cream hover:text-dark-brown">
              ALL MENU
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Section - Couvee Style */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?w=800&h=500&fit=crop"
                alt="Coffee with friends"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="text-center md:text-left">
              <blockquote className="quote-text">
                &ldquo;A cup of coffee shared with a friend is happiness tasted and time well spent.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section - Couvee Style */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="order-2 md:order-1 animate-slide-in-right">
              <h2 className="section-title text-dark-brown">LOCATIONS</h2>
              <p className="text-lg text-dark-brown/80 leading-relaxed mb-8">
                Kopi Kita telah hadir di berbagai lokasi untuk menemani hari-hari Anda.
                Kunjungi outlet terdekat dan nikmati kopi berkualitas dengan suasana nyaman.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white rounded-lg shadow">
                  <h3 className="font-bold text-dark-brown mb-2">Yogyakarta</h3>
                  <p className="text-sm text-dark-brown/70">Jl. Kaliurang Km 5</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <h3 className="font-bold text-dark-brown mb-2">Jakarta</h3>
                  <p className="text-sm text-dark-brown/70">Coming Soon</p>
                </div>
              </div>
              <Link href="/booking" className="btn-primary">
                <span>ALL LOCATIONS</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 12.285 7.02">
                  <path d="M8.529,128.1l-.194.194a.329.329,0,0,0,0,.465l2.3,2.288H.329a.329.329,0,0,0-.329.329v.274a.329.329,0,0,0,.329.329H10.636l-2.3,2.288a.329.329,0,0,0,0,.465l.194.194a.329.329,0,0,0,.465,0l3.194-3.181a.329.329,0,0,0,0-.465L8.994,128.1A.329.329,0,0,0,8.529,128.1Z" transform="translate(0 -128)" />
                </svg>
              </Link>
            </div>
            
            {/* Image */}
            <div className="order-1 md:order-2 relative animate-slide-in-left">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=800&fit=crop"
                alt="Kopi Kita Location"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Find Us Section - Couvee Style */}
      <section className="py-24 bg-dark-brown">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-cream mb-8">FIND US ON INSTAGRAM!</h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cream hover:text-accent transition-colors text-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 28">
              <path d="M16 14c0-2.203-1.797-4-4-4s-4 1.797-4 4 1.797 4 4 4 4-1.797 4-4zM18.156 14c0 3.406-2.75 6.156-6.156 6.156s-6.156-2.75-6.156-6.156 2.75-6.156 6.156-6.156 6.156 2.75 6.156 6.156zM19.844 7.594c0 0.797-0.641 1.437-1.437 1.437s-1.437-0.641-1.437-1.437 0.641-1.437 1.437-1.437 1.437 0.641 1.437 1.437zM12 4.156c-1.75 0-5.5-0.141-7.078 0.484-0.547 0.219-0.953 0.484-1.375 0.906s-0.688 0.828-0.906 1.375c-0.625 1.578-0.484 5.328-0.484 7.078s-0.141 5.5 0.484 7.078c0.219 0.547 0.484 0.953 0.906 1.375s0.828 0.688 1.375 0.906c1.578 0.625 5.328 0.484 7.078 0.484s5.5 0.141 7.078-0.484c0.547-0.219 0.953-0.484 1.375-0.906s0.688-0.828 0.906-1.375c0.625-1.578 0.484-5.328 0.484-7.078s0.141-5.5-0.484-7.078c-0.219-0.547-0.484-0.953-0.906-1.375s-0.828-0.688-1.375-0.906c-1.578-0.625-5.328-0.484-7.078-0.484zM24 14c0 1.656 0.016 3.297-0.078 4.953-0.094 1.922-0.531 3.625-1.937 5.031s-3.109 1.844-5.031 1.937c-1.656 0.094-3.297 0.078-4.953 0.078s-3.297 0.016-4.953-0.078c-1.922-0.094-3.625-0.531-5.031-1.937s-1.844-3.109-1.937-5.031c-0.094-1.656-0.078-3.297-0.078-4.953s-0.016-3.297 0.078-4.953c0.094-1.922 0.531-3.625 1.937-5.031s3.109-1.844 5.031-1.937c1.656-0.094 3.297-0.078 4.953-0.078s3.297-0.016 4.953 0.078c1.922 0.094 3.625 0.531 5.031 1.937s1.844 3.109 1.937 5.031c0.094 1.656 0.078 3.297 0.078 4.953z" />
            </svg>
            <span>@kopikita.id</span>
          </a>
        </div>
      </section>
    </>
  );
}
