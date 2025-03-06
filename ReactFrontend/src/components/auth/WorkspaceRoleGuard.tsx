import { useParams } from "react-router-dom";
import UnauthorizedPage from "../../pages/UnauthorizedPage";

import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

interface WorkspaceRoleGuardProps{
    requiredRole: string;
    children: React.ReactNode;
}

const WorkspaceRoleGuard: React.FC<WorkspaceRoleGuardProps> = ({ requiredRole, children }) => {
    const { workspaceId } = useParams();
    const { getWorkspaceRole, loading,isAdmin } = useAuth();
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
      return <LoadingSpinner />;
    }

    if (isAdmin || workspaceRole === requiredRole || workspaceRole === "owner") {
      return <>{children}</>;
    }

    return <UnauthorizedPage />;
  };
  
  export default WorkspaceRoleGuard;