import React from 'react';


import { useAuth } from '../../context/AuthContext';
import UnauthorizedPage from '../../pages/UnauthorizedPage';
import LoadingSpinner from '../LoadingSpinner';

type RoleGuardProps = {
  requiredRole: string;
  children: React.ReactNode;
};

const RoleGuard: React.FC<RoleGuardProps> = ({ requiredRole, children }) => {
  const { user, loading } = useAuth();

  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || (user.role !== requiredRole && user.role !== "admin")) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};

export default RoleGuard;