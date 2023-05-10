"use client";

// https://tanstack.com/query/v4/docs/react/guides/ssr#queryclientprovider-is-required-by-both-the-initialdata-and-hydrate-prefetching-approaches

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const queryClient = new QueryClient();

export const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
