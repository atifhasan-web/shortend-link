'use client';

import { useEffect } from 'react';
import Preloader from '@/components/preloader';

export default function Redirector({ url }: { url: string }) {
  useEffect(() => {
    if (url) {
      window.location.href = url;
    }
  }, [url]);

  return <Preloader />;
}
