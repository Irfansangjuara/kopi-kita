'use client';

import { useState } from 'react';
import { menuItems, categories } from '@/lib/menu-data';

export default function MenuPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems =
    activeFilter === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeFilter);

  return (
    <>
      {/* Page Header */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=600&fit=crop)',
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-cream">
            <span>Menu</span>
          </h1>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark-brown text-center mb-10">
            PRODUCTS
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`filter-btn px-6 py-2 rounded-full border-2 border-dark-brown font-medium transition-all ${
                  activeFilter === category.id
                    ? 'bg-dark-brown text-cream'
                    : 'bg-transparent text-dark-brown hover:bg-dark-brown/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  {/* Overlay with description */}
                  <div className="product-overlay absolute inset-0 bg-dark-brown/80 flex items-center justify-center opacity-0 transition-opacity duration-300">
                    <div className="text-center px-4">
                      <p className="text-cream text-sm mb-2">{item.description}</p>
                      <span className="text-cream font-semibold">
                        + See Description
                      </span>
                    </div>
                  </div>
                  {/* Sold Out Badge */}
                  {!item.available && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Sold Out
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-dark-brown text-lg mb-1">
                    {item.name}
                  </h3>
                  <p className="text-light-brown font-medium">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <p className="text-center text-dark-brown/60 py-12">
              Tidak ada menu di kategori ini.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
