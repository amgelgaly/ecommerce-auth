'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

type Role = 'admin' | 'seller' | 'customer';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  fallback?: ReactNode; // عنصر بديل يظهر للمستخدمين غير المصرح لهم
}

export function AuthGuard({ children, allowedRoles, fallback = null }: AuthGuardProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const userRole = session?.user?.role;
  const isAuthorized = userRole && allowedRoles.includes(userRole);

  if (!session || !isAuthorized) {
    if (fallback) {
      return fallback;
    }
    redirect('/');
  }

  return <>{children}</>;
}

export function AdminOnly({ children, fallback }: Omit<AuthGuardProps, 'allowedRoles'>) {
  return (
    <AuthGuard allowedRoles={['admin']} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function SellerOnly({ children, fallback }: Omit<AuthGuardProps, 'allowedRoles'>) {
  return (
    <AuthGuard allowedRoles={['seller']} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function AdminOrSellerOnly({ children, fallback }: Omit<AuthGuardProps, 'allowedRoles'>) {
  return (
    <AuthGuard allowedRoles={['admin', 'seller']} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}