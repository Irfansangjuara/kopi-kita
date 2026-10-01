'use client';

import { useState, FormEvent } from 'react';

interface FormData {
  name: string;
  whatsapp: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  whatsapp?: string;
  date?: string;
  time?: string;
  guests?: string;
}

export default function BookingPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    whatsapp: '',
    date: '',
    time: '',
    guests: '1',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    }

    // WhatsApp validation
    const waRegex = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    } else if (!waRegex.test(formData.whatsapp.replace(/[\s-]/g, ''))) {
      newErrors.whatsapp = 'Format nomor WhatsApp tidak valid';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Tanggal wajib diisi';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Tanggal tidak boleh sebelum hari ini';
      }
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = 'Waktu wajib diisi';
    }

    // Guests validation
    const guestsNum = parseInt(formData.guests);
    if (!formData.guests || guestsNum < 1) {
      newErrors.guests = 'Jumlah tamu minimal 1 orang';
    } else if (guestsNum > 50) {
      newErrors.guests = 'Jumlah tamu maksimal 50 orang';
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      whatsapp: '',
      date: '',
      time: '',
      guests: '1',
      notes: '',
    });
    setIsSubmitted(false);
    setErrors({});
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* Page Header */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&h=600&fit=crop)',
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-cream">
            <span>Booking</span>
          </h1>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4 max-w-2xl">
          {!isSubmitted ? (
            <>
              <h2 className="text-3xl font-bold text-dark-brown text-center mb-4">
                RESERVASI TEMPAT
              </h2>
              <p className="text-dark-brown/70 text-center mb-10">
                Isi form di bawah untuk melakukan reservasi. Tim kami akan menghubungi
                Anda melalui WhatsApp untuk konfirmasi.
              </p>

              <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg space-y-6"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-dark-brown font-medium mb-2"
                  >
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                      errors.name
                        ? 'border-red-500'
                        : 'border-gray-200 focus:border-accent'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label
                    htmlFor="whatsapp"
                    className="block text-dark-brown font-medium mb-2"
                  >
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                      errors.whatsapp
                        ? 'border-red-500'
                        : 'border-gray-200 focus:border-accent'
                    }`}
                  />
                  {errors.whatsapp && (
                    <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-dark-brown font-medium mb-2"
                    >
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={today}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                        errors.date
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-accent'
                      }`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="block text-dark-brown font-medium mb-2"
                    >
                      Waktu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      min="08:00"
                      max="21:00"
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                        errors.time
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-accent'
                      }`}
                    />
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label
                    htmlFor="guests"
                    className="block text-dark-brown font-medium mb-2"
                  >
                    Jumlah Tamu <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                      errors.guests
                        ? 'border-red-500'
                        : 'border-gray-200 focus:border-accent'
                    }`}
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} orang
                      </option>
                    ))}
                    <option value="21-30">21-30 orang</option>
                    <option value="31-40">31-40 orang</option>
                    <option value="41-50">41-50 orang</option>
                  </select>
                  {errors.guests && (
                    <p className="text-red-500 text-sm mt-1">{errors.guests}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-dark-brown font-medium mb-2"
                  >
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ada permintaan khusus? Tulis di sini..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg transition-colors focus:border-accent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-dark-brown text-cream py-4 rounded-lg font-semibold hover:bg-light-brown transition-colors"
                >
                  Kirim Reservasi
                </button>
              </form>
            </>
          ) : (
            /* Confirmation Card */
            <div className="bg-white p-8 rounded-xl shadow-lg text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-dark-brown mb-4">
                Reservasi Berhasil!
              </h2>
              <p className="text-dark-brown/70 mb-6">
                Terima kasih, <strong>{formData.name}</strong>! Tim kami akan
                menghubungi Anda melalui WhatsApp di{' '}
                <strong>{formData.whatsapp}</strong> untuk konfirmasi reservasi.
              </p>

              <div className="bg-cream rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-dark-brown mb-4">
                  Detail Reservasi:
                </h3>
                <div className="space-y-2 text-dark-brown/80">
                  <p>
                    <span className="font-medium">Tanggal:</span>{' '}
                    {new Date(formData.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Waktu:</span> {formData.time} WIB
                  </p>
                  <p>
                    <span className="font-medium">Jumlah Tamu:</span> {formData.guests}{' '}
                    orang
                  </p>
                  {formData.notes && (
                    <p>
                      <span className="font-medium">Catatan:</span> {formData.notes}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={resetForm}
                className="bg-dark-brown text-cream px-6 py-3 rounded-lg font-semibold hover:bg-light-brown transition-colors"
              >
                Buat Reservasi Lagi
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
