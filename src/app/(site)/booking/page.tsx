import type { Metadata } from 'next';
import Image from 'next/image';
import BookingForm from '@/components/booking-form';

export const metadata: Metadata = {
  title: 'Book a Table',
  description:
    'Reserve a table at Kopi Kita for coffee, conversation, and an easygoing break in Yogyakarta.',
};

export default function BookingPage() {
  return (
    <>
      <section
        aria-labelledby="booking-page-title"
        className="relative flex min-h-[18rem] items-center overflow-hidden bg-cover bg-center sm:min-h-[25rem]"
        style={{
          backgroundImage: "url('/template/booking/contact-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#4A2C2A]/30" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-[#FAF3E0]/85 uppercase">
            Kopi Kita reservations
          </p>
          <h1
            id="booking-page-title"
            className="max-w-3xl text-5xl font-bold tracking-tight text-[#FAF3E0] sm:text-7xl"
          >
            Booking
          </h1>
          <div className="mt-5 h-1 w-20 bg-[#D9822B]" />
        </div>
      </section>

      <section className="bg-[#FAF3E0] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(32rem,1.18fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-sm bg-[#fffdf8] shadow-[0_20px_60px_rgba(74,44,42,0.1)]">
              <div className="absolute inset-x-0 top-0 h-2 bg-[#D9822B]" />
              <Image
                src="/template/booking/contact-decoration.jpg"
                alt="Origami birds from the supplied coffee shop design"
                width={454}
                height={366}
                sizes="(max-width: 1023px) calc(100vw - 2.5rem), 38vw"
                className="h-auto w-full"
                priority
              />
            </div>

            <div className="mt-8">
              <p className="mb-2 text-xs font-bold tracking-[0.24em] text-[#D9822B] uppercase">
                Come as you are
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-[#4A2C2A] sm:text-4xl">
                Coffee tastes better together.
              </h2>
              <p className="mt-4 max-w-xl leading-8 text-[#4A2C2A]/72">
                Pick a date, choose an hourly time slot, and we will have your table ready for a calm catch-up at Kopi Kita.
              </p>

              <dl className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="border-l-2 border-[#D9822B] bg-[#fffdf8] px-4 py-3">
                  <dt className="text-xs font-bold tracking-[0.15em] text-[#4A2C2A]/55 uppercase">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-[#4A2C2A]">
                    Jl. Kaliurang Km 5, Yogyakarta
                  </dd>
                </div>
                <div className="border-l-2 border-[#D9822B] bg-[#fffdf8] px-4 py-3">
                  <dt className="text-xs font-bold tracking-[0.15em] text-[#4A2C2A]/55 uppercase">
                    Booking hours
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-[#4A2C2A]">
                    Daily, 10:00–21:00
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          <BookingForm />
        </div>
      </section>
    </>
  );
}
