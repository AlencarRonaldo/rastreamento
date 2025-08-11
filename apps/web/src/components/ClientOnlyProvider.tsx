'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnlyProvider({ children, fallback = null }: ClientOnlyProviderProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default ClientOnlyProvider;