import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  User,
  History,
  Settings,
  MessageSquare,
  Users,
  Bot,
} from 'lucide-react';

const navigation = [
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Auto-Comment', href: '/dashboard/auto-comment', icon: Bot },
  { name: 'History', href: '/dashboard/history', icon: History },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  {
    name: 'Feature Request',
    href: '/dashboard/feature-request',
    icon: MessageSquare,
  },
  { name: 'Join Community', href: '/dashboard/community', icon: Users },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className='flex h-screen bg-card border-r border-border w-64'>
      <div className='flex flex-col flex-1'>
        {/* Header */}
        <div className='flex items-center justify-center p-4 border-b border-border'>
          <h1 className='text-xl font-bold text-primary'>commentify</h1>
        </div>

        {/* Navigation */}
        <nav className='flex-1 space-y-1 p-2'>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary border-r-2 border-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className='h-5 w-5 mr-3' />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Trial Banner */}
        <div className='p-4'>
          <div className='bg-gradient-primary rounded-lg p-4 text-white text-center'>
            <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3'>
              <User className='h-6 w-6' />
            </div>
            <h3 className='font-semibold mb-1'>Trial Expired</h3>
            <p className='text-sm opacity-90 mb-3'>
              Your trial is over, but your journey doesn't stop here!
            </p>
            <Button
              variant='secondary'
              size='sm'
              className='w-full bg-white text-primary hover:bg-white/90'
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
