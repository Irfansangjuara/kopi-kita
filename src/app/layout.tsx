import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
