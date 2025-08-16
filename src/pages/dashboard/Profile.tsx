import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  Share2,
  Chrome,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, token } = useAuth();
  const [extensionStatus, setExtensionStatus] = useState('not-connected');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [pairingData, setPairingData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [extensionInfo, setExtensionInfo] = useState(null);
  const [pairingTimer, setPairingTimer] = useState(0); // Timer in seconds
  const [isPairingActive, setIsPairingActive] = useState(false);

  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Only check extension status once on component mount
    checkExtensionStatus();
  }, [user]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const checkExtensionStatus = async () => {
    if (!user) return;

    try {
      setIsChecking(true);

      const response = await fetch(
        'http://localhost:5000/api/auth/check-extension-status',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id || user._id,
            userEmail: user.email,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExtensionInfo(data.extensionInfo);

        if (data.isPaired && data.extensionInfo?.userEmail === user.email) {
          setExtensionStatus('connected');
          // Stop pairing timer and polling if connected
          stopPairingProcess();
        } else if (
          data.isPaired &&
          data.extensionInfo?.userEmail !== user.email
        ) {
          setExtensionStatus('wrong-user');
          stopPairingProcess();
        } else {
          setExtensionStatus('not-connected');
        }
      } else {
        setExtensionStatus('not-connected');
      }
    } catch (error) {
      console.error('Error checking extension status:', error);
      setExtensionStatus('not-connected');
    } finally {
      setIsChecking(false);
    }
  };

  const startPairingProcess = () => {
    setIsPairingActive(true);
    setPairingTimer(180); // 3 minutes = 180 seconds

    // Start timer countdown
    timerRef.current = setInterval(() => {
      setPairingTimer((prev) => {
        if (prev <= 1) {
          stopPairingProcess();
          toast({
            title: 'Pairing timeout',
            description: 'Pairing session expired. Please try again.',
            variant: 'destructive',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start polling every 5 seconds
    intervalRef.current = setInterval(checkExtensionStatus, 5000);
  };

  const stopPairingProcess = () => {
    setIsPairingActive(false);
    setPairingTimer(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const connectExtension = async () => {
    if (!user || !token) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to connect the extension.',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Create pairing data
      const pairingInfo = {
        userId: user.id || user._id,
        userEmail: user.email,
        authToken: token,
        timestamp: new Date().toISOString(),
      };
      console.log('Pairing info:', pairingInfo);

      // Store in localStorage for extension to access
      localStorage.setItem(
        'linkedin_extension_pairing',
        JSON.stringify(pairingInfo)
      );

      // Also send to backend to track pairing attempts
      await fetch('http://localhost:5000/api/auth/initiate-pairing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pairingInfo),
      });

      setPairingData(pairingInfo);

      // Start the pairing process with timer and polling
      startPairingProcess();

      toast({
        title: 'Extension pairing started',
        description:
          'Click the extension icon in your browser toolbar to complete pairing. You have 3 minutes.',
      });

      setIsConnecting(false);
    } catch (error) {
      console.error('Error preparing extension pairing:', error);
      toast({
        title: 'Connection failed',
        description: 'Failed to prepare extension pairing. Please try again.',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const disconnectExtension = async () => {
    try {
      // Clear extension storage via backend
      await fetch('http://localhost:5000/api/auth/disconnect-extension', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id || user._id,
        }),
      });

      // Clear local storage
      localStorage.removeItem('linkedin_extension_pairing');
      setPairingData(null);
      setExtensionStatus('not-connected');
      setExtensionInfo(null);
      stopPairingProcess();

      toast({
        title: 'Extension disconnected',
        description: 'Your extension has been disconnected successfully.',
      });
    } catch (error) {
      console.error('Error disconnecting extension:', error);
      toast({
        title: 'Disconnect failed',
        description: 'Failed to disconnect extension. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyPairingData = async () => {
    if (!pairingData) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(pairingData, null, 2));
      setCopied(true);
      toast({
        title: 'Pairing data copied',
        description: 'Paste this data in the extension to complete pairing.',
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying data:', error);
      toast({
        title: 'Copy failed',
        description: 'Please copy the data manually.',
        variant: 'destructive',
      });
    }
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getExtensionStatusBadge = () => {
    switch (extensionStatus) {
      case 'connected':
        return (
          <Badge variant='default' className='bg-green-500'>
            Connected
          </Badge>
        );
      case 'wrong-user':
        return <Badge variant='destructive'>Wrong User</Badge>;
      case 'connecting':
        return <Badge variant='secondary'>Connecting...</Badge>;
      default:
        return <Badge variant='destructive'>Not Connected</Badge>;
    }
  };

  const getExtensionStatusText = () => {
    switch (extensionStatus) {
      case 'connected':
        return `Connected to ${extensionInfo?.userEmail || 'your account'}`;
      case 'wrong-user':
        return `Extension is paired with ${
          extensionInfo?.userEmail || 'another user'
        }. Please disconnect and reconnect.`;
      case 'connecting':
        return 'Connecting your LinkedIn account...';
      default:
        return 'Connect your LinkedIn account through our Chrome extension';
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Profile</h1>
        <p className='text-muted-foreground mt-2'>
          Manage your profile information and LinkedIn connection
        </p>
      </div>

      <Card className='shadow-card'>
        <CardHeader className='text-center pb-6'>
          <div className='flex flex-col items-center space-y-4'>
            <Avatar className='h-24 w-24'>
              <AvatarImage src='' alt={user?.username || 'User'} />
              <AvatarFallback className='bg-primary text-primary-foreground text-2xl'>
                {user?.username?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className='text-center'>
              <CardTitle className='text-2xl'>
                {user?.username || 'User'}
              </CardTitle>
              <p className='text-muted-foreground mt-1'>
                @{user?.username || 'user'}
              </p>
              <Badge variant='default' className='mt-2'>
                Active
              </Badge>
            </div>

            <div className='flex space-x-3'>
              <Button variant='outline' size='sm'>
                <Trash2 className='h-4 w-4 mr-2' />
                Delete Account
              </Button>
              <Button variant='outline' size='sm'>
                <Share2 className='h-4 w-4 mr-2' />
                Share Profile
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className='pt-6'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-semibold mb-3'>
                LinkedIn Connection
              </h3>
              <div className='bg-gradient-secondary rounded-lg p-4 border border-border'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium text-foreground'>
                      Chrome Extension Status
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {getExtensionStatusText()}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    {getExtensionStatusBadge()}
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={checkExtensionStatus}
                      disabled={isChecking}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isChecking ? 'animate-spin' : ''
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Pairing Timer */}
                {isPairingActive && (
                  <div className='mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Clock className='h-4 w-4 text-yellow-600' />
                        <span className='text-sm font-medium text-yellow-800'>
                          Pairing in progress...
                        </span>
                      </div>
                      <div className='text-sm font-mono text-yellow-800'>
                        {formatTimer(pairingTimer)}
                      </div>
                    </div>
                    <p className='text-xs text-yellow-700 mt-1'>
                      Click the extension icon in your browser toolbar to
                      complete pairing
                    </p>
                  </div>
                )}

                <div className='mt-3 space-y-2'>
                  {extensionStatus === 'connected' ? (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={disconnectExtension}
                      className='w-full'
                    >
                      Disconnect Extension
                    </Button>
                  ) : extensionStatus === 'wrong-user' ? (
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={disconnectExtension}
                      className='w-full'
                    >
                      Disconnect and Reconnect
                    </Button>
                  ) : !pairingData ? (
                    <Button
                      variant='gradient'
                      size='sm'
                      onClick={connectExtension}
                      disabled={isConnecting}
                      className='w-full'
                    >
                      <Chrome className='h-4 w-4 mr-2' />
                      {isConnecting ? 'Preparing...' : 'Connect Extension'}
                    </Button>
                  ) : (
                    <div className='space-y-3'>
                      <div className='bg-background rounded-lg p-3 border border-border'>
                        <p className='text-sm font-medium text-foreground mb-2'>
                          Pairing Data Ready
                        </p>
                        <p className='text-xs text-muted-foreground mb-3'>
                          Click the extension icon in your browser toolbar to
                          complete pairing
                        </p>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={copyPairingData}
                          className='w-full'
                        >
                          {copied ? (
                            <>
                              <Check className='h-4 w-4 mr-2' />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className='h-4 w-4 mr-2' />
                              Copy Pairing Data
                            </>
                          )}
                        </Button>
                      </div>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setPairingData(null);
                          stopPairingProcess();
                        }}
                        className='w-full'
                      >
                        Cancel Pairing
                      </Button>
                    </div>
                  )}

                  {extensionStatus === 'not-connected' && !pairingData && (
                    <div className='text-xs text-muted-foreground'>
                      <p>1. Install our Chrome extension</p>
                      <p>2. Click "Connect Extension" above</p>
                      <p>3. Click the extension icon in your browser toolbar</p>
                      <p>4. Follow the pairing instructions</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-3'>Account Statistics</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-gradient-card rounded-lg p-4 border border-border'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Comments
                  </p>
                  <p className='text-2xl font-bold text-foreground'>0</p>
                </div>
                <div className='bg-gradient-card rounded-lg p-4 border border-border'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Active Keywords
                  </p>
                  <p className='text-2xl font-bold text-foreground'>6</p>
                </div>
                <div className='bg-gradient-card rounded-lg p-4 border border-border'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Success Rate
                  </p>
                  <p className='text-2xl font-bold text-foreground'>0%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-3'>Recent Activity</h3>
              <div className='bg-gradient-card rounded-lg p-6 border border-border text-center'>
                <p className='text-muted-foreground'>No recent activity</p>
                <p className='text-sm text-muted-foreground mt-1'>
                  Connect your LinkedIn account to start automating comments
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
