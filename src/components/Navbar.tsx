'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Booking', href: '/booking' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="Kopi Kita — halaman utama" onClick={() => setIsOpen(false)}>
          <span className="brand__mark" aria-hidden="true">K</span>
          <span className="brand__name">Kopi Kita</span>
        </Link>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {links.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} aria-current={isActive ? 'page' : undefined}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className={`menu-toggle${isOpen ? ' is-open' : ''}`}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-navigation" className={`mobile-menu${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="mobile-menu__brand" aria-hidden="true">Kopi Kita</div>
        <nav aria-label="Navigasi seluler">
          {links.map((link, index) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
                tabIndex={isOpen ? 0 : -1}
              >
                <span>0{index + 1}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
