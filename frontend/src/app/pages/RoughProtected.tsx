import React, { ReactNode } from 'react';
import { useAuth } from '@features/auth';

interface RoughProtectedProps {
  children: ReactNode;
  role: string;
  redirectTo?: string;
  openLoginModal?: () => void;
}

export default function RoughProtected({ children, role, redirectTo = '/', openLoginModal }: RoughProtectedProps) {
  const { user } = useAuth();
  
  if (user === null) {
    openLoginModal?.();
    return null;
  }
  
  if (user.role !== role) {
    return <p>Unauthorized to access this route</p>;
  }
  
  return <>{children}</>;
}
