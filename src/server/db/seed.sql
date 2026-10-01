-- Clear existing data (safe for reset script)
DELETE FROM sessions;
DELETE FROM bookings;
DELETE FROM admins;
DELETE FROM products;

-- Reset serial sequences
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
ALTER SEQUENCE admins_id_seq   RESTART WITH 1;

-- 10 realistic Kopi Kita products
INSERT INTO products (name, description, price, category, image_url, available) VALUES
  ('Kopi Susu Kita',    'Espresso tegas berpadu susu creamy untuk teman setiap suasana.',          25000, 'kopi',     'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600&h=600&fit=crop', true),
  ('Americano',         'Espresso hitam yang bersih dan bold untuk menyegarkan harimu.',            18000, 'kopi',     'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&h=600&fit=crop', true),
  ('Es Kopi Gula Aren', 'Kopi susu dingin dengan manis legit gula aren pilihan.',                   27000, 'kopi',     'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop', true),
  ('Cappuccino',        'Espresso lembut tertutup buih susu hangat yang creamy sempurna.',           26000, 'kopi',     'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&h=600&fit=crop', true),
  ('Cold Brew',         'Kopi seduh dingin 12 jam — halus, rendah asam, dan menyegarkan.',          29000, 'kopi',     'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', true),
  ('Matcha Latte',      'Matcha harum dan susu lembut menghadirkan rasa yang menenangkan.',          28000, 'non-kopi', 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=600&fit=crop', true),
  ('Coklat Panas',      'Cokelat pekat yang hangat dengan rasa manis seimbang.',                     24000, 'non-kopi', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&h=600&fit=crop', true),
  ('Croissant',         'Pastry berlapis yang renyah di luar dan lembut di dalam.',                  22000, 'pastry',   '/template/menu/croissant.jpg', true),
  ('Roti Bakar Keju',   'Roti bakar hangat dengan lelehan keju gurih yang melimpah.',                23000, 'pastry',   '/template/menu/roti-bakar-keju.jpg', true),
  ('Banana Bread',      'Roti pisang moist dengan aroma kayu manis yang menggoda.',                  20000, 'pastry',   '/template/menu/banana-bread.jpg', false);

-- Admin account
-- email: admin@kopikita.id  |  password: kopikita-admin
INSERT INTO admins (email, password_hash) VALUES
  ('admin@kopikita.id', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- 5 sample bookings with varied dates and statuses
INSERT INTO bookings (customer_name, whatsapp, booking_date, booking_time, party_size, notes, status) VALUES
  ('Budi Santoso',    '08123456789', '2030-11-05', '19:00', 4, 'Meja dekat jendela kalau bisa',     'pending'),
  ('Siti Aminah',     '08234567890', '2030-11-08', '18:30', 2, 'Anniversary dinner',                'confirmed'),
  ('Reza Pratama',    '08345678901', '2030-10-30', '12:00', 6, 'Team lunch, butuh proyektor',        'done'),
  ('Diana Kusuma',    '08456789012', '2030-11-12', '20:00', 3, '',                                   'pending'),
  ('Hendra Wijaya',   '08567890123', '2030-11-01', '17:30', 5, 'Ulang tahun, tolong siapkan lilin',  'cancelled');
