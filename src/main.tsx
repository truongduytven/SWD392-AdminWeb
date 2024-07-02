import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/global/atoms/ui/toaster.tsx'
import ErrorBoundary from './ErrorBoundary' // Add this import
import { AuthProvider } from './auth/AuthProvider.tsx'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
        <Toaster />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
