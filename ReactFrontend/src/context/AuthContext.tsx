  import axios from "axios";
  import { createContext, useContext, useEffect, useState } from "react";


  type User = { 
    email: string; 
    role: string; // Global role เช่น 'admin', 'user'
    workspaceRoles?: { workspaceId: string; role: string }[]; // Workspace-specific roles
  };
  
  type AuthContextType = { 
      user: User | null;
      isAuthenticated: boolean;
      loading: boolean;
      login: (email: string, password: string) => Promise<void>;
      logout: () => void;
      getWorkspaceRole: (workspaceId: string) => Promise<string | null>; // ฟังก์ชันสำหรับดึง workspaceRole
  };

  export const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // ตรวจสอบ Token เมื่อโหลดหน้าใหม่
      const fetchUser = async () => {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/users/profile`, {
            withCredentials: true,
          });
          setUser(data);
        } catch (error) {
          console.error('User not authenticated:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, []);


    const login = async (email: string, password: string) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/auth/google/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(data.user);
    };


    const logout = async () => {
      await axios.post(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    };


    // ฟังก์ชันสำหรับดึง role ใน workspace ที่กำหนด
    const getWorkspaceRole = async (workspaceId: string): Promise<string | null> => {
      try {
        // เรียก API เพื่อดึง role จาก workspaceId ที่ระบุ
        const { data } = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/my-role`, {
          withCredentials: true,
        });
        console.log(data.role)
        return data.role; 
      } catch (error) {
        console.error(`Error fetching role for workspace ${workspaceId}:`, error);
        return null;
      }
    };
    
    return (
      <AuthContext.Provider 
        value={{ 
          user, 
          isAuthenticated: !!user, 
          loading, 
          login, 
          logout,
          getWorkspaceRole,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };