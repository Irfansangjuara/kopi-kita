'use client';

import {
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import posthog from 'posthog-js';
import { apiFetch } from '@/lib/api';

type BookingDetails = {
  fullName: string;
  whatsapp: string;
  date: string;
  time: string;
  partySize: string;
  notes: string;
};

type FieldName = keyof BookingDetails;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

// API booking row returned after a successful POST
interface BookingResponse {
  id: number;
  customer_name: string;
  whatsapp: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  notes: string | null;
  status: string;
}

const EMPTY_BOOKING: BookingDetails = {
  fullName: '',
  whatsapp: '',
  date: '',
  time: '',
  partySize: '',
  notes: '',
};

const REQUIRED_FIELDS: FieldName[] = [
  'fullName',
  'whatsapp',
  'date',
  'time',
  'partySize',
];

const TIME_OPTIONS = Array.from(
  { length: 12 },
  (_, index) => `${String(index + 10).padStart(2, '0')}:00`,
);

const INPUT_CLASS =
  'mt-2 w-full rounded-sm border bg-[#fffdf8] px-4 py-3 text-[15px] text-[#4A2C2A] shadow-sm transition placeholder:text-[#4A2C2A]/40 focus:border-[#D9822B] focus:ring-2 focus:ring-[#D9822B]/20';

function getLocalDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isRealDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return (
    parsed.getFullYear() === Number(year) &&
    parsed.getMonth() === Number(month) - 1 &&
    parsed.getDate() === Number(day)
  );
}

function validateBooking(details: BookingDetails, today: string): FormErrors {
  const errors: FormErrors = {};

  if (!details.fullName.trim()) {
    errors.fullName = 'Please enter your full name.';
  }
  if (!details.whatsapp) {
    errors.whatsapp = 'Please enter your WhatsApp number.';
  } else if (!/^\d+$/.test(details.whatsapp)) {
    errors.whatsapp = 'WhatsApp number must contain digits only.';
  } else if (details.whatsapp.length < 10) {
    errors.whatsapp = 'WhatsApp number must be at least 10 digits.';
  }
  if (!details.date) {
    errors.date = 'Please choose a date.';
  } else if (!isRealDate(details.date)) {
    errors.date = 'Please choose a valid date.';
  } else if (today && details.date < today) {
    errors.date = 'Booking date cannot be in the past.';
  }
  if (!details.time) {
    errors.time = 'Please choose a time.';
  } else if (!TIME_OPTIONS.includes(details.time)) {
    errors.time = 'Please choose a valid time.';
  }
  if (!details.partySize) {
    errors.partySize = 'Please enter your party size.';
  } else {
    const partySize = Number(details.partySize);
    if (!Number.isInteger(partySize) || partySize < 1 || partySize > 4) {
      errors.partySize = 'Party size must be between 1 and 4. For larger groups, contact us on WhatsApp.';
    }
  }

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-[#B42318]">
      {message}
    </p>
  );
}

export default function BookingForm() {
  const [details, setDetails] = useState<BookingDetails>(EMPTY_BOOKING);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [today] = useState(() => getLocalDateValue(new Date()));
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<BookingResponse | null>(null);
  const bookingStartedRef = useRef(false);

  const errors = useMemo(() => validateBooking(details, today), [details, today]);
  const isValid = today !== '' && Object.keys(errors).length === 0;

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const field = event.target.name as FieldName;

    if (!bookingStartedRef.current) {
      bookingStartedRef.current = true;
      posthog.capture('booking_started', { source_page: '/booking' });
    }

    setDetails((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleBlur(
    event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const field = event.target.name as FieldName;
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError(null);

    if (!isValid) {
      setTouched(
        REQUIRED_FIELDS.reduce<TouchedFields>((acc, field) => {
          acc[field] = true;
          return acc;
        }, {}),
      );
      return;
    }

    setSubmitting(true);
    try {
      const booking = await apiFetch<BookingResponse>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: details.fullName.trim(),
          whatsapp: details.whatsapp,
          booking_date: details.date,
          booking_time: details.time,
          party_size: Number(details.partySize),
          notes: details.notes.trim() || undefined,
        }),
      });
      posthog.capture('booking_submitted', {
        party_size: booking.party_size,
        time_slot: booking.booking_time,
      });
      setConfirmed(booking);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setApiError('Connection problem, please try again.');
      } else {
        setApiError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setDetails(EMPTY_BOOKING);
    setTouched({});
    setApiError(null);
    setConfirmed(null);
  }

  // ── Confirmation card ───────────────────────────────────────────────────────
  if (confirmed) {
    const summary: [string, string][] = [
      ['Booking ID', `#${confirmed.id}`],
      ['Full name', confirmed.customer_name],
      ['WhatsApp number', confirmed.whatsapp],
      ['Date', confirmed.booking_date],
      ['Time', confirmed.booking_time],
      ['Party size', `${confirmed.party_size} ${confirmed.party_size === 1 ? 'guest' : 'guests'}`],
      ['Notes', confirmed.notes?.trim() || 'No notes added'],
      ['Status', confirmed.status],
    ];

    return (
      <section
        aria-labelledby="booking-confirmation-title"
        className="rounded-sm border border-[#D9822B]/25 bg-[#fffdf8] px-5 py-8 shadow-[0_20px_60px_rgba(74,44,42,0.12)] sm:px-8 sm:py-10"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D9822B] text-[#fffdf8] shadow-lg shadow-[#D9822B]/25">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none">
            <path
              d="m5 12.5 4.25 4.25L19 7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.25"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="mb-2 text-xs font-bold tracking-[0.24em] text-[#D9822B] uppercase">
            Reservation received
          </p>
          <h2
            id="booking-confirmation-title"
            className="text-3xl font-bold tracking-tight text-[#4A2C2A] sm:text-4xl"
          >
            We got your booking!
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#4A2C2A]/70 sm:text-base">
            Thanks, {confirmed.customer_name}. Your reservation is now pending confirmation.
          </p>
        </div>

        <dl className="mt-8 divide-y divide-[#4A2C2A]/10 border-y border-[#4A2C2A]/10">
          {summary.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="text-xs font-bold tracking-[0.12em] text-[#4A2C2A]/55 uppercase">
                {label}
              </dt>
              <dd className="break-words text-sm font-medium text-[#4A2C2A] sm:text-base">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={resetForm}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-sm bg-[#4A2C2A] px-6 py-3.5 text-sm font-bold tracking-[0.1em] text-[#FAF3E0] uppercase transition hover:bg-[#D9822B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A2C2A]"
        >
          Make Another Booking
          <span aria-hidden="true">→</span>
        </button>
      </section>
    );
  }

  // ── Booking form ───────────────────────────────────────────────────────────
  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-sm border border-[#4A2C2A]/10 bg-[#fffdf8] p-5 shadow-[0_20px_60px_rgba(74,44,42,0.12)] sm:p-8"
    >
      <div className="mb-8 border-b border-[#4A2C2A]/10 pb-6">
        <p className="mb-2 text-xs font-bold tracking-[0.24em] text-[#D9822B] uppercase">
          Reservation details
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-[#4A2C2A] sm:text-4xl">
          Book your table
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#4A2C2A]/70">
          Plan a relaxed coffee break at Kopi Kita. We welcome groups of up to eight guests.
        </p>
      </div>

      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        {/* Full name */}
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="text-sm font-bold text-[#4A2C2A]">
            Full name <span className="text-[#D9822B]">*</span>
          </label>
          <input
            id="fullName" name="fullName" type="text" autoComplete="name" required
            value={details.fullName} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={touched.fullName && Boolean(errors.fullName)}
            aria-describedby={touched.fullName && errors.fullName ? 'fullName-error' : undefined}
            placeholder="Your full name"
            className={`${INPUT_CLASS} ${touched.fullName && errors.fullName ? 'border-[#B42318]' : 'border-[#4A2C2A]/20'}`}
          />
          <FieldError id="fullName-error" message={touched.fullName ? errors.fullName : undefined} />
        </div>

        {/* WhatsApp */}
        <div className="sm:col-span-2">
          <label htmlFor="whatsapp" className="text-sm font-bold text-[#4A2C2A]">
            WhatsApp number <span className="text-[#D9822B]">*</span>
          </label>
          <input
            id="whatsapp" name="whatsapp" type="tel" inputMode="numeric" autoComplete="tel"
            required minLength={10} pattern="[0-9]+"
            value={details.whatsapp} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={touched.whatsapp && Boolean(errors.whatsapp)}
            aria-describedby={touched.whatsapp && errors.whatsapp ? 'whatsapp-error' : undefined}
            placeholder="Example: 081234567890"
            className={`${INPUT_CLASS} ${touched.whatsapp && errors.whatsapp ? 'border-[#B42318]' : 'border-[#4A2C2A]/20'}`}
          />
          <FieldError id="whatsapp-error" message={touched.whatsapp ? errors.whatsapp : undefined} />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="text-sm font-bold text-[#4A2C2A]">
            Date <span className="text-[#D9822B]">*</span>
          </label>
          <input
            id="date" name="date" type="date" required min={today || undefined}
            value={details.date} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={touched.date && Boolean(errors.date)}
            aria-describedby={touched.date && errors.date ? 'date-error' : undefined}
            className={`${INPUT_CLASS} ${touched.date && errors.date ? 'border-[#B42318]' : 'border-[#4A2C2A]/20'}`}
          />
          <FieldError id="date-error" message={touched.date ? errors.date : undefined} />
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time" className="text-sm font-bold text-[#4A2C2A]">
            Time <span className="text-[#D9822B]">*</span>
          </label>
          <select
            id="time" name="time" required
            value={details.time} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={touched.time && Boolean(errors.time)}
            aria-describedby={touched.time && errors.time ? 'time-error' : undefined}
            className={`${INPUT_CLASS} ${touched.time && errors.time ? 'border-[#B42318]' : 'border-[#4A2C2A]/20'}`}
          >
            <option value="">Choose a time</option>
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <FieldError id="time-error" message={touched.time ? errors.time : undefined} />
        </div>

        {/* Party size */}
        <div className="sm:col-span-2">
          <label htmlFor="partySize" className="text-sm font-bold text-[#4A2C2A]">
            Party size <span className="text-[#D9822B]">*</span>
          </label>
          <input
            id="partySize" name="partySize" type="number" inputMode="numeric"
            required min={1} max={4} step={1}
            value={details.partySize} onChange={handleChange} onBlur={handleBlur}
            aria-invalid={touched.partySize && Boolean(errors.partySize)}
            aria-describedby={touched.partySize && errors.partySize ? 'partySize-error' : undefined}
            placeholder="1–4 guests"
            className={`${INPUT_CLASS} ${touched.partySize && errors.partySize ? 'border-[#B42318]' : 'border-[#4A2C2A]/20'}`}
          />
          <FieldError id="partySize-error" message={touched.partySize ? errors.partySize : undefined} />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="text-sm font-bold text-[#4A2C2A]">
            Notes <span className="font-normal text-[#4A2C2A]/50">(optional)</span>
          </label>
          <textarea
            id="notes" name="notes" rows={4}
            value={details.notes} onChange={handleChange} onBlur={handleBlur}
            placeholder="Anything we should know before you arrive?"
            className={`${INPUT_CLASS} resize-y border-[#4A2C2A]/20`}
          />
        </div>
      </div>

      {/* API-level error */}
      {apiError && (
        <p className="mt-4 rounded-sm bg-[#FFF0EE] px-4 py-3 text-sm font-medium text-[#B42318]">
          {apiError}
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-sm bg-[#4A2C2A] px-6 py-3.5 text-sm font-bold tracking-[0.1em] text-[#FAF3E0] uppercase transition enabled:hover:bg-[#D9822B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A2C2A] disabled:cursor-not-allowed disabled:bg-[#4A2C2A]/35 disabled:text-[#FAF3E0]/75"
      >
        {submitting ? 'Sending…' : 'Book Now'}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
