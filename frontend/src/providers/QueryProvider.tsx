import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { toast } from 'react-hot-toast';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            onError: (error: any) => {
              const message = error.response?.data?.message || 'An unexpected error occurred';
              toast.error(message);
            },
          },
          mutations: {
            onError: (error: any) => {
              const message = error.response?.data?.message || 'Action failed';
              toast.error(message);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}