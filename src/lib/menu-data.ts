export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'basic' | 'signature' | 'flavored-coffee' | 'non-coffee';
  image: string;
  available: boolean;
}

export const menuItems: MenuItem[] = [
  // Signature
  {
    id: '1',
    name: 'Kopi Susu Kita',
    description: 'Espresso dengan susu segar dan gula aren pilihan, menjadi favorit kami.',
    price: 22000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: '2',
    name: 'Melacca Latte',
    description: 'Caffe latte dengan gula merah premium dari Melaka, manis dengan sentuhan karamel.',
    price: 28000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: '3',
    name: 'Black Cookie Latte',
    description: 'Latte dengan cookie vanilla cream dan chocolate, klasik yang tak terlupakan.',
    price: 30000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop',
    available: true,
  },
  // Basic
  {
    id: '4',
    name: 'Espresso',
    description: 'Shot espresso murni dari biji kopi pilihan Indonesia.',
    price: 15000,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: '5',
    name: 'Americano',
    description: 'Espresso dengan air panas, rasa bold dan bold.',
    price: 18000,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: '6',
    name: 'Cappuccino',
    description: 'Espresso dengan steamed milk dan foam lembut.',
    price: 24000,
    category: 'basic',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
    available: true,
  },
  // Flavored Coffee
  {
    id: '7',
    name: 'Caramel Macchiato',
    description: 'Vanilla syrup, steamed milk, espresso, dan drizzle caramel.',
    price: 32000,
    category: 'flavored-coffee',
    image: 'https://images.unsplash.com/photo-1544252890-9e8e09c2d8ae?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: '8',
    name: 'Hazelnut Latte',
    description: 'Latte dengan syrup hazelnut yang creamy dan harum.',
    price: 30000,
    category: 'flavored-coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: '9',
    name: 'Mocha',
    description: 'Espresso, chocolate, dan steamed milk dalam harmoni sempurna.',
    price: 32000,
    category: 'flavored-coffee',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=400&fit=crop',
    available: false,
  },
  // Non-Coffee
  {
    id: '10',
    name: 'Red Velvet Latte',
    description: 'Minuman red velvet dengan cream cheese yang lembut.',
    price: 28000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1544252890-c3e95e867d59?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: '11',
    name: 'Matcha Latte',
    description: 'Matcha premium dari Jepang dengan susu segar.',
    price: 28000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: '12',
    name: 'Chocolate',
    description: 'Coklat premium dengan susu segar dan whipped cream.',
    price: 26000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop',
    available: true,
  },
];

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'basic', name: 'Basic' },
  { id: 'signature', name: 'Signature' },
  { id: 'flavored-coffee', name: 'Flavored Coffee' },
  { id: 'non-coffee', name: 'Non-Coffee' },
];
