
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FullPageLoader } from './FullPageLoader';

interface AuthCheckerProps {
  children: React.ReactNode;
}

export const AuthChecker: React.FC<AuthCheckerProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const isDemoAdmin = localStorage.getItem('demoAdminLoggedIn') === 'true';
        
        if (isDemoAdmin) {
          console.log('User is authenticated via demo mode');
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          navigate('/login');
          return;
        }
        
        if (!data.session) {
          console.log('No session found, redirecting to login');
          navigate('/login');
          return;
        }
        
        console.log('User is authenticated via Supabase');
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
