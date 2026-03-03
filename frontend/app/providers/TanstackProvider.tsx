'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function TanstackProvider({ children }: { children: React.ReactNode }) {
  // useState para garantir que o QueryClient seja criado apenas uma vez
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Considera os dados "frescos" por 1 minuto
        retry: 1, // Se o Java der erro, tenta apenas mais uma vez
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}