import { useParams } from "react-router-dom";
import UnauthorizedPage from "../../pages/UnauthorizedPage";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

interface ProjectPermissionGuardProps {
  children: React.ReactNode;
}

const ProjectPermissionGuard: React.FC<ProjectPermissionGuardProps> = ({ children }) => {
  const { workspaceId, projectId } = useParams<{ workspaceId?: string; projectId?: string }>();
  const { getProjectPermission, loading } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchPermission = async () => {
      if (!workspaceId || !projectId) {
        setChecking(false);
        return;
      }

      const permission = await getProjectPermission(workspaceId, projectId);
      setHasPermission(permission);
      setChecking(false);
    };

    fetchPermission();
  }, [workspaceId, projectId, getProjectPermission]);

  if (loading || checking) {
    return <LoadingSpinner /> 
  }

  if (!hasPermission) {
    return <UnauthorizedPage />; 
  }

  return <>{children}</>;
};

export default ProjectPermissionGuard;
