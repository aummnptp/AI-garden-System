import { BACKEND_API_URL } from "../../env";

const PROJECT_ROUTES = {
    base: `${BACKEND_API_URL}/workspaces`,
    updateProjectPermission: (workspaceId: string, projectId: string) =>
      `${PROJECT_ROUTES.base}/${workspaceId}/projects/update/${projectId}`,
   grantPermission: (workspaceId: string, projectId: string) =>
      `${PROJECT_ROUTES.base}/${workspaceId}/projects/permissions/grant/${projectId}`,
   revokePermission: (workspaceId: string, projectId: string) =>
    `${PROJECT_ROUTES.base}/${workspaceId}/projects/permissions/revoke/${projectId}`,

  
};

export default PROJECT_ROUTES;
