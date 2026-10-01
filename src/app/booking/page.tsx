'use client';

import { useState, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  date: string;
  time: string;
  guests: string;
  message: string;
}

export default function BookingPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    date: '',
    time: '',
    guests: '2',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }

    // Phone validation (numbers only)
    const phoneRegex = /^[0-9+]+$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Nomor telepon hanya boleh berisi angka';
    }

    // WhatsApp validation (numbers only, no letters)
    if (!phoneRegex.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Nomor WhatsApp hanya boleh berisi angka';
    }

    // Date validation (not in the past)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date);
    if (!formData.date || selectedDate < today) {
      newErrors.date = 'Tanggal tidak boleh hari yang sudah lewat';
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = 'Waktu wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <>
        {/* Page Title */}
        <section
          className="page-title-overlay"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&h=600&fit=crop)',
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2>
              <span>Booking</span>
            </h2>
          </div>
        </section>

        {/* Confirmation Card */}
        <section className="py-24 bg-cream">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-dark-brown mb-4">Booking Berhasil!</h2>
              <p className="text-dark-brown/70 mb-8">
                Terima kasih, {formData.name}! Booking Anda telah kami terima.
                Kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi.
              </p>
              
              {/* Booking Details */}
              <div className="bg-cream rounded-lg p-6 text-left mb-8">
                <h3 className="font-bold text-dark-brown mb-4 text-center">Detail Booking</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-dark-brown/60">Nama</p>
                    <p className="font-medium text-dark-brown">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-dark-brown/60">Email</p>
                    <p className="font-medium text-dark-brown">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-dark-brown/60">Tanggal</p>
                    <p className="font-medium text-dark-brown">
                      {new Date(formData.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-brown/60">Waktu</p>
                    <p className="font-medium text-dark-brown">{formData.time}</p>
                  </div>
                  <div>
                    <p className="text-dark-brown/60">Jumlah Tamu</p>
                    <p className="font-medium text-dark-brown">{formData.guests} orang</p>
                  </div>
                  <div>
                    <p className="text-dark-brown/60">WhatsApp</p>
                    <p className="font-medium text-dark-brown">{formData.whatsapp}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    whatsapp: '',
                    date: '',
                    time: '',
                    guests: '2',
                    message: '',
                  });
                }}
                className="btn-primary"
              >
                Booking Lagi
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Page Title */}
      <section
        className="page-title-overlay"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&h=600&fit=crop)',
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2>
            <span>Booking</span>
          </h2>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-dark-brown text-center">RESERVASI TEMPAT</h2>
            <p className="text-center text-dark-brown/70 mb-12">
              Pesan tempat Anda untuk meeting, gathering, atau sekadar nongkrong bersama teman-teman.
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-dark-brown font-medium mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:border-accent transition-colors`}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-dark-brown font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:border-accent transition-colors`}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-dark-brown font-medium mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:border-accent transition-colors`}
                    placeholder="08xxxxxxxxxx"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="whatsapp" className="block text-dark-brown font-medium mb-2">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                    } focus:border-accent transition-colors`}
                    placeholder="08xxxxxxxxxx"
                  />
                  {errors.whatsapp && (
                    <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-dark-brown font-medium mb-2">
                    Tanggal *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    } focus:border-accent transition-colors`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="time" className="block text-dark-brown font-medium mb-2">
                    Waktu *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    } focus:border-accent transition-colors`}
                  >
                    <option value="">Pilih waktu</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                  </select>
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                  )}
                </div>

                {/* Guests */}
                <div className="md:col-span-2">
                  <label htmlFor="guests" className="block text-dark-brown font-medium mb-2">
                    Jumlah Tamu *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent transition-colors"
                  >
                    <option value="1">1 orang</option>
                    <option value="2">2 orang</option>
                    <option value="3">3 orang</option>
                    <option value="4">4 orang</option>
                    <option value="5">5 orang</option>
                    <option value="6">6 orang</option>
                    <option value="7">7 orang</option>
                    <option value="8">8 orang</option>
                    <option value="10">10 orang</option>
                    <option value="15">15+ orang</option>
                  </select>
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-dark-brown font-medium mb-2">
                    Pesan Tambahan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent transition-colors resize-none"
                    placeholder="Ada permintaan khusus? Tulis di sini..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button type="submit" className="btn-primary text-lg px-8 py-4">
                  Kirim Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
