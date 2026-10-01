import Link from 'next/link';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Booking', href: '/booking' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__birds" aria-hidden="true" />
      <div className="landing-container site-footer__content">
        <div className="site-footer__brand">
          <span className="site-footer__mark" aria-hidden="true">K</span>
          <div>
            <strong>Kopi Kita</strong>
            <p>Kopi hangat, ruang yang akrab.</p>
          </div>
        </div>

        <div className="site-footer__grid">
          <div>
            <h2>Tautan</h2>
            <nav aria-label="Navigasi footer">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>{link.label}</Link>
              ))}
            </nav>
          </div>
          <div>
            <h2>Kunjungi</h2>
            <address>Jl. Kaliurang Km 5<br />Sleman, Yogyakarta</address>
          </div>
          <div>
            <h2>Jam Buka</h2>
            <p>Setiap hari<br /><strong>10.00–22.00 WIB</strong></p>
          </div>
          <div>
            <h2>Terhubung</h2>
            <a href="mailto:halo@kopikita.id">halo@kopikita.id</a>
            <a href="https://instagram.com/kopikita.id" target="_blank" rel="noreferrer">@kopikita.id</a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} Kopi Kita</p>
          <p>Dibuat untuk teman ngopi Yogyakarta.</p>
        </div>
      </div>
    </footer>
  );
}
