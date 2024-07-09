import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary' // Add this import
import { AuthProvider } from './auth/AuthProvider.tsx'
import { Toaster } from 'sonner'
import { Toaster as Toast } from '@/components/global/atoms/ui/toaster.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toast />

          <Toaster position='top-right' richColors />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
