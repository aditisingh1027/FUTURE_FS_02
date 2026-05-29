import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#cbd5e1',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.875rem',
              borderRadius: '0.75rem',
            },
            success: { iconTheme: { primary: '#3b82f6', secondary: '#1e293b' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#1e293b' } },
          }}
        />

        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
