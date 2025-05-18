import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const Layout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { currentUser } = useAuth();

  // If the user is a candidate, don't show the admin layout
  if (currentUser?.role === UserRole.CANDIDATE) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;