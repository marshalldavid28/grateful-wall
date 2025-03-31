
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onSignOut: () => void;
  pendingCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onSignOut,
  pendingCount = 0
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your application content and settings
          {pendingCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              {pendingCount} pending approval
            </span>
          )}
        </p>
      </div>
      
      <Button variant="outline" onClick={onSignOut}>
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};
