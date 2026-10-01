'use client';

import { useState } from 'react';
import ProductCard from '@/components/product-card';
import type {
  MenuCategoryFilter,
  MenuCategoryOption,
  MenuItem,
} from '@/lib/menu-data';

interface MenuCatalogProps {
  categories: ReadonlyArray<MenuCategoryOption>;
  products: ReadonlyArray<MenuItem>;
}

export default function MenuCatalog({
  categories,
  products,
}: MenuCatalogProps) {
  const [activeCategory, setActiveCategory] =
    useState<MenuCategoryFilter>('all');

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter kategori menu"
        className="mb-10 flex flex-wrap justify-center gap-x-3 gap-y-1 sm:mb-12 sm:gap-x-7"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              id={`menu-tab-${category.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="menu-products"
              onClick={() => setActiveCategory(category.id)}
              className={`relative cursor-pointer px-2 py-3 text-sm font-semibold transition-colors after:absolute after:inset-x-[15%] after:bottom-1 after:h-1 after:bg-accent after:transition-transform sm:px-1 sm:text-base ${
                isActive
                  ? 'text-dark-brown after:scale-x-100'
                  : 'text-[#8D8D8D] after:scale-x-0 hover:text-dark-brown hover:after:scale-x-100'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <div
        id="menu-products"
        role="tabpanel"
        aria-labelledby={`menu-tab-${activeCategory}`}
        aria-live="polite"
        className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-7"
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
