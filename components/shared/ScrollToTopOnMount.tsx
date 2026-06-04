'use client';

import { useLayoutEffect } from 'react';

export function ScrollToTopOnMount() {
  useLayoutEffect(() => {
    if (window.location.hash) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return null;
}
