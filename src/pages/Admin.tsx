
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TestimonialsManager } from '@/components/admin/TestimonialsManager';
import { AuthChecker } from '@/components/admin/AuthChecker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Admin = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('demoAdminLoggedIn');
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <AuthChecker>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12 md:py-20 max-w-7xl mx-auto w-full">
          <AdminHeader onSignOut={handleSignOut} pendingCount={pendingCount} />
          <TestimonialsManager onUpdatePendingCount={setPendingCount} />
        </main>

        <footer className="border-t py-6 sm:py-8 px-4 sm:px-6 mt-8 sm:mt-12">
          <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Adtechademy. Admin Panel</p>
          </div>
        </footer>
      </div>
    </AuthChecker>
  );
};

export default Admin;
