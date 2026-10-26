import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { ThemeProvider } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F1F5F9] transition-colors duration-200">
              <Navbar />
              <div className="flex-1">
                <AppRoutes />
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
