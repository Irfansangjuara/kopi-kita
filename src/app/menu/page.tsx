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
      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden md:min-h-[400px]">
        <Image
          src="/template/menu/menu-hero.jpg"
          alt="Dua minuman Kopi Kita yang sedang dinikmati bersama"
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-[#4A2C2A]/35 to-[#4A2C2A]/75" />
        <div className="relative z-10 max-w-2xl px-6 text-center text-[#FAF3E0]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm">
            Racikan Pilihan
          </p>
          <h1 className="text-4xl font-bold tracking-[0.12em] drop-shadow-md sm:text-5xl">
            Menu
          </h1>
          <p className="mt-4 text-sm leading-relaxed drop-shadow sm:text-base">
            Nikmati kopi pilihan dan pastry hangat yang diracik untuk setiap
            momen.
          </p>
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
