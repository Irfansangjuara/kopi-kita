export type MenuCategory = 'kopi' | 'non-kopi' | 'pastry';
export type MenuCategoryFilter = 'all' | MenuCategory;

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  available: boolean;
}

export interface MenuCategoryOption {
  id: MenuCategoryFilter;
  name: string;
}

export const categories: ReadonlyArray<MenuCategoryOption> = [
  { id: 'all', name: 'All' },
  { id: 'kopi', name: 'Coffee' },
  { id: 'non-kopi', name: 'Non-Coffee' },
  { id: 'pastry', name: 'Pastry' },
];

export const menuItems: ReadonlyArray<MenuItem> = [
  {
    id: 1,
    name: 'Kopi Susu Kita',
    description: 'Espresso tegas berpadu susu creamy untuk teman setiap suasana.',
    price: 25000,
    category: 'kopi',
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 2,
    name: 'Americano',
    description: 'Espresso hitam yang bersih dan bold untuk menyegarkan harimu.',
    price: 18000,
    category: 'kopi',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 3,
    name: 'Es Kopi Gula Aren',
    description: 'Kopi susu dingin dengan manis legit gula aren pilihan.',
    price: 27000,
    category: 'kopi',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 4,
    name: 'Matcha Latte',
    description: 'Matcha harum dan susu lembut menghadirkan rasa yang menenangkan.',
    price: 28000,
    category: 'non-kopi',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 5,
    name: 'Coklat Panas',
    description: 'Cokelat pekat yang hangat dengan rasa manis seimbang.',
    price: 24000,
    category: 'non-kopi',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 6,
    name: 'Croissant',
    description: 'Pastry berlapis yang renyah di luar dan lembut di dalam.',
    price: 22000,
    category: 'pastry',
    image: '/template/menu/croissant.jpg',
    available: true,
  },
  {
    id: 7,
    name: 'Roti Bakar Keju',
    description: 'Roti bakar hangat dengan lelehan keju gurih yang melimpah.',
    price: 23000,
    category: 'pastry',
    image: '/template/menu/roti-bakar-keju.jpg',
    available: true,
  },
  {
    id: 8,
    name: 'Banana Bread',
    description: 'Roti pisang moist dengan aroma kayu manis yang menggoda.',
    price: 20000,
    category: 'pastry',
    image: '/template/menu/banana-bread.jpg',
    available: false,
  },
];
