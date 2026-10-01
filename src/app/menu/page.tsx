import type { Metadata } from 'next';
import Image from 'next/image';
import MenuCatalog from '@/components/menu-catalog';
import { categories, menuItems } from '@/lib/menu-data';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Jelajahi pilihan kopi, minuman non-kopi, dan pastry hangat dari Kopi Kita.',
};

export default function MenuPage() {
  return (
    <main className="bg-cream text-dark-brown">
      <section className="landing-hero" aria-label="Menu Kopi Kita">
        <Image
          src="/template/landing/atmosphere.jpg"
          alt="Suasana kedai Kopi Kita"
          fill
          loading="eager"
          sizes="100vw"
          className="landing-hero__background"
        />
        <div className="landing-hero__veil" />

        <div className="landing-hero__content">
          <p className="eyebrow">Racikan Pilihan</p>
          <h1>MENU</h1>
          <p className="landing-hero__tagline">Kopi, non-kopi, dan pastry untuk setiap momen.</p>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
        aria-labelledby="products-heading"
      >
        <header className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-light-brown">
            Kopi Kita
          </p>
          <h2
            id="products-heading"
            className="text-3xl font-bold tracking-[0.1em] sm:text-4xl"
          >
            PRODUCTS
          </h2>
        </header>

        <MenuCatalog categories={categories} products={menuItems} />
      </section>
    </main>
  );
}
