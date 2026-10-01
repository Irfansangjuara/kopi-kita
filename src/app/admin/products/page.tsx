'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await apiFetch('/api/auth/me');
      } catch {
        router.push('/admin/login');
        return;
      }
      await fetchProducts();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiFetch<Product[]>('/api/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    try {
      await apiFetch(`/api/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...product, available: !product.available }),
      });
      await fetchProducts();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      await fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Gagal menghapus produk');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
        <button
          onClick={() => { setEditingProduct(null); setShowModal(true); }}
          className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg transition-colors"
        >
          + Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Produk</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kategori</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Harga</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.category}</td>
                <td className="px-6 py-4 font-mono text-sm text-gray-900">
                  Rp {product.price.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleAvailable(product)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.available ? 'Tersedia' : 'Habis'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => { setEditingProduct(product); setShowModal(true); }}
                    className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchProducts(); }}
        />
      )}
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onSuccess,
}: {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product ?? { name: '', description: '', price: 0, category: 'kopi', image_url: '', available: true },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        await apiFetch(`/api/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Gagal menyimpan produk: ${msg}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {product ? 'Edit Produk' : 'Tambah Produk'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
            <input
              type="text" required value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              required value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg" rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rupiah)</label>
            <input
              type="number" required value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="kopi">Kopi</option>
              <option value="non-kopi">Non-Kopi</option>
              <option value="pastry">Pastry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar</label>
            <input
              type="text" required value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox" checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Produk tersedia</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
