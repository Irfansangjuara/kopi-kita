export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'signature', name: 'Signature' },
  { id: 'flavored-coffee', name: 'Flavored Coffee' },
  { id: 'non-coffee', name: 'Non-Coffee' },
  { id: 'basic', name: 'Basic' },
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Red Velvet Latte',
    description: 'Minuman red velvet favorit dengan sentuhan cream cheese.',
    price: 28000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 2,
    name: 'Melacca',
    description: 'Caffe latte signature dengan gula aren premium.',
    price: 25000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 3,
    name: 'Black Cookie Latte',
    description: 'Minuman klasik dengan chocolate cookies dan vanilla cream.',
    price: 28000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 4,
    name: 'Caramel Macchiato',
    description: 'Caramel latte dengan sedikit kopi dan caramel sauce di atas.',
    price: 30000,
    category: 'flavored-coffee',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 5,
    name: 'Matcha Latte',
    description: 'Creamy dan leafy, twist terbaik dari minuman klasik Jepang.',
    price: 28000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 6,
    name: 'Dark Chocolate',
    description: 'Dark chocolate bold dan intense dengan sentuhan manis.',
    price: 26000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 7,
    name: 'Honey Lemonade',
    description: 'Kombinasi segar longan honey premium, lemon juice, dan soda.',
    price: 24000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=600&fit=crop',
    available: false,
  },
  {
    id: 8,
    name: 'Java',
    description: 'Signature caffe latte dengan kopi intense dan susu kental manis creamy.',
    price: 25000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 9,
    name: 'Necta',
    description: 'Signature caffe latte dengan longan honey premium.',
    price: 27000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 10,
    name: 'Flavored Caffe Latte',
    description: 'Caffe latte dengan 6 varian flavored syrup: Caramel, Creme Brulee, Hazelnut, Salted Caramel, Vanilla, Vanilla Rum.',
    price: 26000,
    category: 'flavored-coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 11,
    name: 'Caffe Mocha',
    description: 'Signature caffe latte dengan kopi intense dan chocolate paste manis.',
    price: 28000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 12,
    name: 'Everyday Latte',
    description: 'Dosis kopi dan susu yang pas, dimaniskan dengan gula merah organik. Sempurna untuk setiap momen.',
    price: 22000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 13,
    name: 'White',
    description: 'Caffe latte klasik yang creamy.',
    price: 20000,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=600&h=600&fit=crop',
    available: true,
  },
  {
    id: 14,
    name: 'Black',
    description: 'Americano strong dan bold, sempurna untuk memulai pagi!',
    price: 18000,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop',
    available: true,
  },
];
