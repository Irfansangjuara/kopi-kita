import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Kopi Kita - Coffee for Everyone',
    template: '%s | Kopi Kita',
  },
  description:
    'Kopi Kita hadir dari ide sederhana bahwa setiap orang berhak menikmati kopi berkualitas. Tidak masalah jika Anda menyukai kopi ringan dan manis, atau preferensi strong tanpa gula, kami siap memenuhi selera Anda.',
  keywords: ['kopi', 'coffee', 'cafe', 'yogyakarta', 'kopi kita', 'coffee shop', 'booking', 'menu'],
  authors: [{ name: 'Kopi Kita' }],
  openGraph: {
    title: 'Kopi Kita - Coffee for Everyone',
    description:
      'Nikmati kopi berkualitas untuk semua selera. Kunjungi menu kami dan pesan tempat Anda di Kopi Kita.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Kopi Kita',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kopi Kita - Coffee for Everyone',
    description:
      'Nikmati kopi berkualitas untuk semua selera. Kunjungi menu kami dan pesan tempat Anda di Kopi Kita.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
