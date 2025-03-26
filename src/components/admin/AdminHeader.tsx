
import React from 'react';

interface AdminHeaderProps {
  onSignOut: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onSignOut }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
      <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
      <button 
        onClick={onSignOut}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
};
