
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// Admin credentials (in a real app, these would be stored securely)
const ADMIN_EMAIL = "admin@adtechademy.com";
const ADMIN_PASSWORD = "Adtech2024!";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      // Check for demo admin login
      const isDemoAdmin = localStorage.getItem('demoAdminLoggedIn') === 'true';
      
      if (isDemoAdmin) {
        navigate('/admin');
        return;
      }
      
      // Check for regular Supabase session
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        navigate('/admin');
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Special case for demo admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // For demo purposes, we're bypassing actual authentication
        setLoading(false);
        
        toast({
          title: "Demo Login Successful",
          description: "Welcome to the admin panel!",
        });
        
        // Set a session flag for demo admin in localStorage
        localStorage.setItem('demoAdminLoggedIn', 'true');
        navigate('/admin');
        return;
      }
      
      // Regular Supabase authentication for non-demo credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel!",
        });
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Failed to sign in. Please check your credentials.');
      toast({
        title: "Login Failed",
        description: error.message || 'Invalid login credentials',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full p-8 border rounded-lg shadow-sm bg-card">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-sm text-center">
            <p className="mb-2 text-muted-foreground">
              This is a protected area. Only administrators can access this page.
            </p>
            <div className="p-4 bg-muted/50 rounded-md">
              <p className="font-medium mb-1">Demo Admin Credentials:</p>
              <p className="text-xs">Email: {ADMIN_EMAIL}</p>
              <p className="text-xs">Password: {ADMIN_PASSWORD}</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Adtechademy. Admin Panel</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
