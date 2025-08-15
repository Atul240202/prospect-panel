import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

export default function Dashboard() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
    { name: 'Auto-Comment', href: '/dashboard/auto-comment', icon: '🤖' },
    { name: 'History', href: '/dashboard/history', icon: '📊' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    { name: 'Feature Request', href: '/dashboard/feature-request', icon: '💡' },
    { name: 'Community', href: '/dashboard/community', icon: '👥' },
  ];

  const currentPage =
    navigation.find((item) => item.href === location.pathname) || navigation[0];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className='fixed inset-0 z-40 lg:hidden'>
          <div
            className='fixed inset-0 bg-gray-600 bg-opacity-75'
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between p-4 border-b'>
          <h1 className='text-xl font-bold'>Dashboard</h1>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setSidebarOpen(false)}
          >
            <X className='h-5 w-5' />
          </Button>
        </div>
        <nav className='mt-4 px-4'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                location.pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className='mr-3'>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className='absolute bottom-4 left-4 right-4'>
          <Button onClick={handleLogout} variant='outline' className='w-full'>
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </Button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col'>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className='lg:pl-64'>
        {/* Top bar */}
        <div className='sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 lg:px-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <Button
                variant='ghost'
                size='sm'
                className='lg:hidden mr-2'
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className='h-5 w-5' />
              </Button>
              <h1 className='text-lg font-semibold text-gray-900'>
                {currentPage.name}
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-500'>Welcome back!</span>
              <Button onClick={handleLogout} variant='outline' size='sm'>
                <LogOut className='mr-2 h-4 w-4' />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className='p-4 lg:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
