'use client';

import { useEffect } from 'react';
import '@/lib/locale-config';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n is initialized in locale-config.ts
  }, []);

  return <>{children}</>;
}
