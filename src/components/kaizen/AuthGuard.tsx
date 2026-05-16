import React, { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { trpc } from '../../utils/trpc';
import { LoginScreen } from './LoginScreen';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const settings = trpc.settings.query.useQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const sessionCookie = getCookie('kaizen-session');
    if (sessionCookie) {
      setIsAuthenticated(true);
    }
  }, []);

  // Allow app to load cleanly if authEnabled is toggled off
  const authEnabled = (settings.data?.appConfig as any)?.authEnabled === true;

  if (!isClient || settings.isLoading) {
    // Avoid SSR hydration flickering during initial state mounting
    return <>{children}</>;
  }

  if (!authEnabled || isAuthenticated) {
    return <>{children}</>;
  }

  return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
}
