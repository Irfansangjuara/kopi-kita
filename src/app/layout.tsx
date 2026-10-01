import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'Kopi Kita | Kopi Hangat, Ruang yang Akrab',
    template: '%s | Kopi Kita',
  },
  description: 'Kopi Kita adalah kedai kopi hangat di Yogyakarta untuk menikmati racikan favorit, berbincang, bekerja, dan mengambil jeda.',
  keywords: ['Kopi Kita', 'kedai kopi Yogyakarta', 'coffee shop', 'booking meja', 'menu kopi'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
