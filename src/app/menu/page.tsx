'use client';

import { useState } from 'react';
import { menuItems, categories } from '@/lib/menu-data';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Page Title */}
      <section
        className="page-title-overlay"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=600&fit=crop)',
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2>
            <span>Menu</span>
          </h2>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-dark-brown text-center">PRODUCTS</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
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
                className="product-card bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative aspect-square">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {!item.available && <div className="sold-out-badge">Sold Out</div>}
                  <div className="thumb-overlay">
                    <span>+</span>
                    <h3>See Description</h3>
                    <p className="text-cream text-center px-4 text-sm mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-dark-brown text-lg mb-1">{item.name}</h3>
                  <p className="text-light-brown font-medium">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
