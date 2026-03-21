'use client';

import * as React from 'react';

export function useClient(): boolean {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
