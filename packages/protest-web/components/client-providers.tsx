"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface IProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders = (props: IProvidersProps) => {
  const { children } = props;
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
