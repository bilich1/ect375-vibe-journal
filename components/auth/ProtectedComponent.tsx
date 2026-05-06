'use client';

import { useAuthContext } from '@/lib/auth/AuthContext';
import { Permission, hasPermission } from '@/lib/auth/roles';
import React from 'react';

interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredPermission: Permission;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders if user has required permission
 */
export function ProtectedComponent({
  children,
  requiredPermission,
  fallback = null,
}: ProtectedComponentProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return fallback;
  }

  if (!hasPermission(user.role, requiredPermission)) {
    return fallback || <div className="p-4 text-red-600">Access Denied</div>;
  }

  return <>{children}</>;
}
