'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false, // Prevents refetching when switching tabs back and forth
        refetchOnReconnect: false, // Prevents refetching on network reconnect
        retry: (failureCount, error: any) => {
          // Never retry on auth errors
          if (error?.response?.status === 401 || error?.response?.status === 403) return false;
          // Retry other errors only once
          return failureCount < 1;
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
