import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, FileText, BarChart2, 
  Settings, LogOut, Menu, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import Avatar from '../ui/Avatar';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentUser, logout } = useAuth();

  const isAdmin = currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.ADMIN;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HIRING_MANAGER] },
    { name: 'Departments', path: '/departments', icon: <Building2 size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
    { name: 'Interviews', path: '/interviews', icon: <FileText size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HIRING_MANAGER] },
    { name: 'Candidates', path: '/candidates', icon: <Users size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HIRING_MANAGER] },
    { name: 'Users', path: '/users', icon: <Users size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HIRING_MANAGER] },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(
    item => currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 m-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md text-gray-700 bg-white shadow-md hover:bg-gray-50"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">InterviewPro</span>
            </div>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 rounded-md text-sm font-medium
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <Avatar 
                src={currentUser?.avatar}
                alt={currentUser?.name || 'User'}
                size="sm"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">
                  {currentUser?.role.replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={logout}
                className="ml-auto text-gray-400 hover:text-gray-500"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;