import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // <-- 1. ADD THIS IMPORT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* <-- 2. WRAP <App /> WITH THIS */}
      <App />
    </AuthProvider>
  </StrictMode>,
);