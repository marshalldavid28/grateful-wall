
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Admin credentials (in a real app, these would be stored securely)
const ADMIN_EMAIL = "admin@adtechademy.com";
const ADMIN_PASSWORD = "Adtech2024!";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        navigate('/admin');
      }
    };

    checkSession();
    
    // Create or ensure admin user exists
    const createAdminUser = async () => {
      // Check if admin exists
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(ADMIN_EMAIL);
      
      if (userError || !userData) {
        // Admin doesn't exist, create it
        const { error } = await supabase.auth.admin.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true
        });
        
        if (error) {
          console.error("Failed to create admin user:", error);
        } else {
          console.log("Admin user created successfully");
        }
      }
    };
    
    // Note: This function won't work from the client side due to Supabase's security restrictions
    // In a real app, this would be done through a secure backend process
    // For this demo, we'll assume the admin user is created manually
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setLoading(false);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Login Successful",
      description: "Welcome to the admin panel!",
    });
    
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full p-8 border rounded-lg shadow-sm bg-card">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
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
