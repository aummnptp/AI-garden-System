import React from 'react';

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UnauthorizedPage from '../../pages/UnauthorizedPage';

type RoleGuardProps = {
  requiredRole: string;
  children: React.ReactNode;
};

const RoleGuard: React.FC<RoleGuardProps> = ({ requiredRole, children }) => {
  const { isAuthenticated,user, loading } = useAuth();


  if (!isAuthenticated) {
    // Redirect ไปยัง Google Login พร้อม state เก็บหน้าที่ผู้ใช้พยายามเข้าถึง
    const loginUrl = `${import.meta.env.VITE_NEST_BACKEND_API_URL}/auth/google/login`;
    const redirectUrl = `${loginUrl}?redirect=${encodeURIComponent(location.pathname)}`;
    window.location.href = redirectUrl;
    return null; 
  }
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (user.role !== requiredRole && user.role !== "admin")) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};

export default RoleGuard;