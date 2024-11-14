import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import AppAuthContext from './context/AppAuthContext.tsx'
import AppModalContext from './context/AppModalContext.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 0
    }
  }
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppAuthContext>
          <AppModalContext>
            <App />
          </AppModalContext>
        </AppAuthContext>
      </QueryClientProvider>
      <Toaster />
    </BrowserRouter>
  </StrictMode>
)
