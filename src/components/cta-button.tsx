'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useFeatureFlagVariantKey } from '@posthog/react';
import posthog from 'posthog-js';

const CTA_FLAG = 'cta-landing';

interface CtaButtonProps {
  className: string;
  suffix?: ReactNode;
}

export default function CtaButton({ className, suffix }: CtaButtonProps) {
  const flagVariant = useFeatureFlagVariantKey(CTA_FLAG);
  const variant = flagVariant === 'test' ? 'test' : 'control';
  const label = variant === 'test' ? 'Reserve Your Table' : 'Booking Meja';

  return (
    <Link
      href="/booking"
      className={className}
      onClick={() => posthog.capture('cta_clicked', { cta_variant: variant })}
    >
      {label}
      {suffix}
    </Link>
  );
}
