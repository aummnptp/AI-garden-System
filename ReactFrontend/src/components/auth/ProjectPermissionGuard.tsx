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
  const { getProjectPermission, loading  , isAdmin, isOwner} = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isWorkspaceOwner, setIsWorkspaceOwner] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchPermission = async () => {
      if (!workspaceId || !projectId) {
        setChecking(false);
        return;
      }

      const [permission, ownerStatus] = await Promise.all([
        getProjectPermission(workspaceId, projectId),
        isOwner(workspaceId),
      ]);

      setHasPermission(permission);
      setIsWorkspaceOwner(ownerStatus);
      setChecking(false);
    };

    fetchPermission();
  }, [workspaceId, projectId, getProjectPermission, isOwner]);

  if (loading || checking) {
    return <LoadingSpinner />;
  }
  if (isAdmin || isWorkspaceOwner || hasPermission) {
    return <>{children}</>;
  }

  return <UnauthorizedPage />;
};

export default ProjectPermissionGuard;
