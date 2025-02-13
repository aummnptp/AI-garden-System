import { useParams } from "react-router-dom";
import UnauthorizedPage from "../../pages/UnauthorizedPage";

import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

interface WorkspaceRoleGuardProps{
    requiredRole: string;
    children: React.ReactNode;
}

const WorkspaceRoleGuard: React.FC<WorkspaceRoleGuardProps> = ({ requiredRole, children }) => {
    const { workspaceId } = useParams(); // ใช้ workspaceId จาก URL
    const { getWorkspaceRole, loading } = useAuth();
    const [workspaceRole, setWorkspaceRole] = useState<string | null>(null);
    const [checking, setChecking] = useState(true);
  
    useEffect(() => {
      const fetchRole = async () => {
        if (!workspaceId) {
          setChecking(false);
          return;
        }
        const role = await getWorkspaceRole(workspaceId);
        setWorkspaceRole(role);
        setChecking(false);
      };
  
      fetchRole();
    }, [workspaceId, getWorkspaceRole]);
  
    if (loading || checking) {
      return <p>Loading...</p>; // แสดง Loading ระหว่างตรวจสอบ
    }
  
    if (!workspaceRole || workspaceRole !== requiredRole && workspaceRole !== "owner") {
      return <UnauthorizedPage/>
    }
  
    return <>{children}</>; // แสดง Component ที่อยู่ใน Guard
  };
  
  export default WorkspaceRoleGuard;