import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kopi Kita - Coffee for Everyone',
  description:
    'Kopi Kita hadir dari ide sederhana bahwa setiap orang berhak menikmati kopi berkualitas. Baik Anda menyukai kopi ringan dan manis, atau preferensi strong tanpa gula, kami siap memenuhi selera Anda.',
  keywords: ['kopi', 'coffee', 'yogyakarta', 'cafe', 'kopi susu', 'espresso'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
