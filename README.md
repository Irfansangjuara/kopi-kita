# Kopi Kita

Frontend kedai kopi untuk Task 1 Modul 2 AI Class Jogja. Desain diadaptasi dari template cafe yang disediakan, lalu seluruh identitas dan copywriting disesuaikan menjadi Kopi Kita.

## Halaman

- `/` — landing page dengan hero, menu favorit, informasi kedai, dan CTA.
- `/menu` — delapan produk dari `src/lib/menu-data.ts`, filter kategori, harga Rupiah, serta status `Sold Out`.
- `/booking` — form reservasi dengan validasi nama, WhatsApp, tanggal, waktu, dan jumlah tamu 1–8; data valid menampilkan kartu konfirmasi lokal tanpa dikirim ke server.

## Teknologi

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Verifikasi

```bash
npm run lint
npm run build
```
