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
    image: '/template/menu/kopi-susu-kita.jpg',
    available: true,
  },
  {
    id: 2,
    name: 'Americano',
    description: 'Espresso hitam yang bersih dan bold untuk menyegarkan harimu.',
    price: 18000,
    category: 'kopi',
    image: '/template/menu/americano-kita.jpg',
    available: true,
  },
  {
    id: 3,
    name: 'Es Kopi Gula Aren',
    description: 'Kopi susu dingin dengan manis legit gula aren pilihan.',
    price: 27000,
    category: 'kopi',
    image: '/template/menu/es-kopi-gula-aren.jpg',
    available: true,
  },
  {
    id: 4,
    name: 'Matcha Latte',
    description: 'Matcha harum dan susu lembut menghadirkan rasa yang menenangkan.',
    price: 28000,
    category: 'non-kopi',
    image: '/template/menu/matcha-latte.jpg',
    available: true,
  },
  {
    id: 5,
    name: 'Coklat Panas',
    description: 'Cokelat pekat yang hangat dengan rasa manis seimbang.',
    price: 24000,
    category: 'non-kopi',
    image: '/template/menu/coklat-panas.jpg',
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
