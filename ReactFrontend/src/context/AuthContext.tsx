import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {  getSessionService, logoutService } from "../api/services/AuthService";


type User = {
  email: string;
  role: string; // Global role เช่น 'admin', 'user'
  workspaceRoles?: { workspaceId: string; role: string }[]; // Workspace-specific roles
};
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  getWorkspaceRole: (workspaceId: string) => Promise<string | null>; // ฟังก์ชันสำหรับดึง workspaceRole
};

export const AuthContext =createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getSession = async () => {
    try {
      const response = await getSessionService(); 
      setUser(response); 
    } catch (error) {
      console.error("User not authenticated:", error);
      setUser(null); 
    } finally {
      setLoading(false); 
    }
  };
  
  const getUserSession = useCallback(() => {
    setLoading(true); // ตั้งค่า loading เป็น true ก่อนเริ่มดึงข้อมูล
    getSession()
      .catch((error) => {
        console.error("Error fetching session:", error);
        setUser(null); // หากมีข้อผิดพลาด ให้ตั้งค่า user เป็น null
      })
      .finally(() => {
        setLoading(false); // กำหนด loading เป็น false หลังจากที่การดึงข้อมูลเสร็จ
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
      // window.location.href = "/"; // กลับไปหน้าแรก
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ฟังก์ชันสำหรับดึง role ใน workspace ที่กำหนด
  const getWorkspaceRole = async (
    workspaceId: string
  ): Promise<string | null> => {
    try {
      // เรียก API เพื่อดึง role จาก workspaceId ที่ระบุ
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_NEST_BACKEND_API_URL
        }/workspaces/${workspaceId}/my-role`,
        {
          withCredentials: true,
        }
      );
      console.log(data.role);
      return data.role; // คาดว่า Backend จะส่ง { role: 'member' } หรือ { role: 'owner' }
    } catch (error) {
      console.error(`Error fetching role for workspace ${workspaceId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    getUserSession(); // เรียกใช้ getUserSession เมื่อ component โหลด
  }, [getUserSession]); 
  
  

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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
