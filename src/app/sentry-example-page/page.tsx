'use client';

import { useState } from 'react';

export default function SentryExamplePage() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Kopi Kita Sentry example error');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
      <h1 className="text-3xl font-bold text-[#4A2C2A]">Sentry test page</h1>
      <p className="text-[#4A2C2A]/70">
        Use this page only to verify that Sentry receives a readable stack trace.
      </p>
      <button
        type="button"
        onClick={() => setShouldThrow(true)}
        className="rounded-sm bg-[#4A2C2A] px-5 py-3 font-bold text-[#FAF3E0]"
      >
        Trigger test error
      </button>
    </main>
  );
}
