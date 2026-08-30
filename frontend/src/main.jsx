import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import router from './routes'
import './index.css'
import './styles/fonts.css' // We will create this

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'toast-custom',
          duration: 3000,
          style: {
            background: '#FFFDF8',
            color: '#17201B',
            border: '1px solid rgba(22, 61, 42, 0.1)',
            boxShadow: '0 12px 32px rgba(22, 61, 42, 0.15)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#22A06B',
              secondary: '#FFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC4C4C',
              secondary: '#FFF',
            },
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
