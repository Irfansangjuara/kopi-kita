'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  productsCount: number;
  pendingBookingsCount: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/me', {
        credentials: 'include',
      });
      if (!res.ok) {
        router.push('/admin/login');
        return;
      }
      await fetchStats();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

  const fetchStats = async () => {
    try {
      const [productsRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:4000/api/products', { credentials: 'include' }),
        fetch('http://localhost:4000/api/bookings', { credentials: 'include' }),
      ]);

      const products = await productsRes.json();
      const bookings = await bookingsRes.json();

      setStats({
        productsCount: products.length,
        pendingBookingsCount: bookings.filter((b: any) => b.status === 'pending').length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <p className="text-4xl font-bold text-amber-900">{stats?.productsCount || 0}</p>
            </div>
            <div className="text-5xl">☕</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Booking Pending</p>
              <p className="text-4xl font-bold text-orange-600">{stats?.pendingBookingsCount || 0}</p>
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