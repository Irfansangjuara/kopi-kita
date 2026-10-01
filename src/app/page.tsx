import Image from 'next/image';
import Link from 'next/link';

const favorites = [
  {
    name: 'Kopi Susu Kita',
    description: 'Espresso lembut, susu segar, dan manis yang seimbang.',
    price: 'Rp 18.000',
    image: '/template/landing/kopi-susu.jpg',
  },
  {
    name: 'Es Kopi Gula Aren',
    description: 'Kopi susu khas kami dengan gula aren yang harum.',
    price: 'Rp 22.000',
    image: '/template/landing/gula-aren.jpg',
  },
  {
    name: 'Matcha Latte',
    description: 'Matcha creamy untuk jeda yang tenang dan menyegarkan.',
    price: 'Rp 25.000',
    image: '/template/landing/matcha.jpg',
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path d="M5 12h13M14 7l5 5-5 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <section className="landing-hero" aria-labelledby="hero-title">
        <Image
          src="/template/landing/atmosphere.jpg"
          alt="Suasana bar dan meja kedai Kopi Kita yang hangat"
          fill
          loading="eager"
          sizes="100vw"
          className="landing-hero__background"
        />
        <div className="landing-hero__veil" />
        <Image
          src="/template/landing/hero-left.png"
          alt=""
          width={468}
          height={703}
          loading="eager"
          aria-hidden="true"
          className="landing-hero__hand landing-hero__hand--left"
        />
        <Image
          src="/template/landing/hero-right.png"
          alt=""
          width={468}
          height={703}
          loading="eager"
          aria-hidden="true"
          className="landing-hero__hand landing-hero__hand--right"
        />

        <div className="landing-hero__content">
          <p className="eyebrow">Kedai kopi di Yogyakarta</p>
          <h1 id="hero-title">KOPI KITA</h1>
          <p className="landing-hero__tagline">Kopi hangat, ruang yang akrab.</p>
          <p className="landing-hero__intro">
            Temukan racikan favoritmu dalam suasana terang, tenang, dan terasa seperti rumah sendiri.
          </p>
          <div className="landing-hero__actions">
            <Link href="/menu" className="button button--solid">
              Lihat Menu <ArrowIcon />
            </Link>
            <Link href="/booking" className="button button--outline">
              Booking Meja
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-story" aria-labelledby="story-title">
        <div className="landing-container landing-split">
          <div className="landing-story__copy">
            <p className="eyebrow">Suasana Kopi Kita</p>
            <h2 id="story-title" className="display-heading">Ruang untuk semua cerita</h2>
            <p>
              Kopi Kita lahir dari gagasan sederhana: kopi enak seharusnya bisa dinikmati siapa saja. Kami menyiapkan setiap cangkir dengan teliti, lalu menyajikannya di ruang yang santai untuk bekerja, berbincang, atau sekadar mengambil jeda.
            </p>
            <Link href="/booking" className="text-link">
              Datang dan duduk bersama <ArrowIcon />
            </Link>
          </div>
          <div className="landing-story__image-wrap">
            <Image
              src="/template/landing/atmosphere.jpg"
              alt="Suasana minimalis dan nyaman di kedai Kopi Kita"
              width={1200}
              height={675}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="landing-story__image"
            />
            <span className="landing-story__stamp" aria-hidden="true">K</span>
          </div>
        </div>
      </section>

      <section className="favorites" aria-labelledby="favorites-title">
        <div className="landing-container">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">Pilihan yang paling dicintai</p>
            <h2 id="favorites-title" className="display-heading">Menu Favorit</h2>
          </div>

          <div className="favorites__grid">
            {favorites.map((item) => (
              <article className="favorite-card" key={item.name}>
                <div className="favorite-card__image-wrap">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="favorite-card__image"
                  />
                  <span className="favorite-card__price">{item.price}</span>
                </div>
                <div className="favorite-card__body">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="section-action">
            <Link href="/menu" className="button button--dark-outline">
              Lihat Semua Menu <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-quote" aria-label="Nilai Kopi Kita">
        <div className="landing-container landing-quote__inner">
          <div className="landing-quote__image-wrap">
            <Image
              src="/template/landing/interior.jpg"
              alt="Pengunjung menikmati suasana kedai Kopi Kita"
              width={500}
              height={731}
              sizes="(max-width: 767px) 100vw, 44vw"
              className="landing-quote__image"
            />
          </div>
          <blockquote>
            &ldquo;Secangkir kopi terasa lebih hangat saat dinikmati bersama orang-orang terdekat.&rdquo;
          </blockquote>
        </div>
      </section>

      <section className="visit" aria-labelledby="visit-title">
        <div className="landing-container">
          <div className="section-heading">
            <p className="eyebrow">Temui kami</p>
            <h2 id="visit-title" className="display-heading">Singgah di Kopi Kita</h2>
          </div>

          <div className="visit__grid">
            <div className="visit__details">
              <div className="info-block">
                <span className="info-block__number">01</span>
                <div>
                  <h3>Jam Buka</h3>
                  <p>Setiap hari</p>
                  <p><strong>10.00–22.00 WIB</strong></p>
                </div>
              </div>
              <div className="info-block">
                <span className="info-block__number">02</span>
                <div>
                  <h3>Alamat</h3>
                  <address>Jl. Kaliurang Km 5, Sleman,<br />Daerah Istimewa Yogyakarta</address>
                </div>
              </div>
              <Link href="/booking" className="button button--solid">
                Booking Meja <ArrowIcon />
              </Link>
            </div>

            <div className="map-placeholder" role="img" aria-label="Placeholder peta lokasi Kopi Kita di Jalan Kaliurang, Yogyakarta">
              <span className="map-placeholder__road map-placeholder__road--one" />
              <span className="map-placeholder__road map-placeholder__road--two" />
              <span className="map-placeholder__road map-placeholder__road--three" />
              <span className="map-placeholder__pin" aria-hidden="true"><b>K</b></span>
              <div className="map-placeholder__label">
                <strong>Kopi Kita</strong>
                <span>Jl. Kaliurang Km 5</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
