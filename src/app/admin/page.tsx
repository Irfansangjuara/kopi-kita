'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

interface Booking {
  status: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [productsCount, setProductsCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Check session first
        await apiFetch('/api/auth/me');
      } catch {
        router.push('/admin/login');
        return;
      }

      try {
        const [products, bookings] = await Promise.all([
          apiFetch<unknown[]>('/api/products'),
          apiFetch<Booking[]>('/api/bookings'),
        ]);
        setProductsCount(products.length);
        setPendingCount(bookings.filter((b) => b.status === 'pending').length);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Produk</p>
              <p className="text-4xl font-bold text-amber-900">{productsCount ?? 0}</p>
            </div>
            <div className="text-5xl">☕</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Booking Pending</p>
              <p className="text-4xl font-bold text-orange-600">{pendingCount ?? 0}</p>
            </div>
            <div className="text-5xl">📅</div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
        <h2 className="text-lg font-semibold text-amber-900 mb-2">Selamat datang di Admin Kopi Kita</h2>
        <p className="text-amber-800">
          Gunakan sidebar untuk mengelola produk dan booking pelanggan.
        </p>
      </div>
    </div>
  );
}
