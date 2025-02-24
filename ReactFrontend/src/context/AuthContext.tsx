import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {  getSessionService, logoutService } from "../api/services/AuthService";


type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: (workspaceId: string) => Promise<boolean>;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  getWorkspaceRole: (workspaceId: string) => Promise<string | null>; 
  getProjectPermission: (workspaceId: string, projectId: string) => Promise<boolean>; 
};

export const AuthContext =createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [workspaceRoles, setWorkspaceRoles] = useState<{ [key: string]: string }>({});
  const getSession = async () => {
    try {
      const response = await getSessionService(); 
      setUser(response); 
    } catch (error) {
      setUser(null); 
    } finally {
      setLoading(false); 
    }
  };
  
  const getUserSession = useCallback(() => {
    setLoading(true);
    getSession()
      .catch(() => {
        setUser(null); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  

  const login = async () => {
    window.location.href = `${
      import.meta.env.VITE_NEST_BACKEND_API_URL
    }/auth/google/login`;
  };

  const logout = async () => {
    try {
      
      await logoutService();
      setUser(null);
    } catch (error) {
    }
  };

  const getWorkspaceRole = useCallback(async (workspaceId: string): Promise<string | null> => {
    if (workspaceRoles[workspaceId]) {
      return workspaceRoles[workspaceId]; 
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/my-role`,
        { withCredentials: true }
      );

      setWorkspaceRoles((prevRoles) => ({ ...prevRoles, [workspaceId]: data.role }));
      return data.role;
    } catch (error) {
      return null;
    }
  }, [workspaceRoles]);

  const isOwner = async (workspaceId: string): Promise<boolean> => {
    if (!workspaceId) return false;
    const role = await getWorkspaceRole(workspaceId);
    return role === "owner";
  };
  
  const getProjectPermission = async (workspaceId: string, projectId: string): Promise<boolean> => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/detail/${projectId}`,
        { withCredentials: true }
      );
      return !!data; 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        console.warn(`Permission denied for project ${projectId}`);
        return false;
      }
      return false;
    }
  };

  useEffect(() => {
    getUserSession(); 
  }, [getUserSession]); 
  


  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        getWorkspaceRole,
        getProjectPermission,
        isAdmin,
        isOwner, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
