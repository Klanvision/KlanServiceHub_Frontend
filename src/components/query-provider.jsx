'use client';
import React from 'react';
import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data freshness: 1 minute (serves instantly from memory)
        staleTime: 60 * 60 * 1000,
        // In-memory cache garbage collection: 15 minutes
        gcTime: 60 * 60 * 1000,
        // Number of retry attempts on query failure
        retry: 1,
        // Cache Validation: Automatically revalidate stale queries when tab/window gains focus
        refetchOnWindowFocus: true,
        // Cache Validation: Automatically revalidate when network reconnects
        refetchOnReconnect: true,
        // Cache Validation: Revalidate stale data on component remount
        refetchOnMount: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

/**
 * Global cache invalidation helpers for fine-grained cache management
 */
export const invalidateEntityCache = (queryClient, entityKey, scopeId) => {
  if (!queryClient) return;
  if (scopeId) {
    queryClient.invalidateQueries({ queryKey: [entityKey, scopeId] });
  } else {
    queryClient.invalidateQueries({ queryKey: [entityKey] });
  }
};

export const QueryProvider = ({ children }) => {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

