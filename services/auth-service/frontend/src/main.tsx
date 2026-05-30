import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ← nuevo
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const queryClient = new QueryClient(); // ← crear cliente

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>   {/* ← envolver aquí */}
      <AuthProvider>
        <BrowserRouter basename="/auth">
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);