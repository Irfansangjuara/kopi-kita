'use client';

/**
 * /menu page — fetches products from the real database via the API.
 * Implements loading skeletons and an error state with "Try Again" button.
 *
 * Pattern for lint compliance (react-hooks/set-state-in-effect):
 * `loading` is DERIVED from `result.key !== key`, not set inside useEffect.
 */

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import ProductCard from '@/components/product-card';
import type { MenuCategoryFilter, MenuCategoryOption, MenuItem } from '@/lib/menu-data';

// DB product shape
interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
}

// Map DB row → MenuItem so ProductCard works unchanged
function toMenuItem(p: ApiProduct): MenuItem {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category as MenuItem['category'],
    image: p.image_url,
    available: p.available,
  };
}

const CATEGORIES: ReadonlyArray<MenuCategoryOption> = [
  { id: 'all', name: 'All' },
  { id: 'kopi', name: 'Coffee' },
  { id: 'non-kopi', name: 'Non-Coffee' },
  { id: 'pastry', name: 'Pastry' },
];

// Skeleton placeholder card
function SkeletonCard() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-square w-full rounded bg-[#E8DDD6]" />
      <div className="mt-3 h-4 w-3/4 rounded bg-[#E8DDD6]" />
      <div className="mt-2 h-3 w-full rounded bg-[#E8DDD6]" />
      <div className="mt-2 h-3 w-1/3 rounded bg-[#E8DDD6]" />
    </div>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryFilter>('all');
  // attempt increments when the user clicks "Try Again"
  const [attempt, setAttempt] = useState(0);

  // result.key tracks which (category, attempt) pair the loaded data belongs to
  const key = `${activeCategory}:${attempt}`;
  const [result, setResult] = useState<{
    key: string;
    data?: MenuItem[];
    error?: string;
  }>({ key: '' });

  // loading is DERIVED — never set with setState inside useEffect
  const loading = result.key !== key;

  useEffect(() => {
    let active = true;
    const path =
      activeCategory === 'all'
        ? '/api/products'
        : `/api/products?category=${activeCategory}`;

    apiFetch<ApiProduct[]>(path)
      .then((raw) => {
        if (active) setResult({ key, data: raw.map(toMenuItem) });
      })
      .catch((e: unknown) => {
        if (active) {
          const msg = e instanceof Error ? e.message : String(e);
          setResult({ key, error: msg });
        }
      });

    return () => {
      active = false;
    };
    // key captures both activeCategory and attempt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const products = result.data ?? [];
  const hasError = !loading && Boolean(result.error);

  return (
    <main className="bg-cream text-dark-brown">
      {/* Hero */}
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

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label="Filter kategori menu"
          className="mb-10 flex flex-wrap justify-center gap-x-3 gap-y-1 sm:mb-12 sm:gap-x-7"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative cursor-pointer px-2 py-3 text-sm font-semibold transition-colors after:absolute after:inset-x-[15%] after:bottom-1 after:h-1 after:bg-accent after:transition-transform sm:px-1 sm:text-base ${
                  isActive
                    ? 'text-dark-brown after:scale-x-100'
                    : 'text-[#8D8D8D] after:scale-x-0 hover:text-dark-brown hover:after:scale-x-100'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Error state */}
        {hasError && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-lg font-semibold text-[#4A2C2A]">
              The menu can&apos;t be loaded right now.
            </p>
            <p className="max-w-sm text-sm text-[#4A2C2A]/60">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => setAttempt((a) => a + 1)}
              className="rounded-sm bg-[#4A2C2A] px-6 py-3 text-sm font-bold tracking-[0.1em] text-[#FAF3E0] uppercase transition hover:bg-[#D9822B]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div
            className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-7"
            aria-label="Loading products"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Products grid */}
        {!loading && !hasError && (
          <div
            id="menu-products"
            role="tabpanel"
            aria-live="polite"
            className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-7"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
