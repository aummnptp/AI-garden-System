import axios from "axios";
import PROJECT_ROUTES from "../routes/ProjectRoutes";
const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;

axios.defaults.withCredentials = true;

export const changeProjectPermissionService = async (workspaceId: string, projectId: string, permissionOnly: boolean) => {
    try {
        const response = await axios.patch(
            PROJECT_ROUTES.updateProjectPermission(workspaceId, projectId),
            { permission_only: permissionOnly },
        );
        return response.data;
    } catch (error) {
        console.error("Error changing project permission:", error);
        throw error;
    }
}

export const grantProjectPermission = async (workspaceId: string,projectId: string, userId: string) => {
    try {
        const response = await axios.post(
            PROJECT_ROUTES.grantPermission(workspaceId, projectId),
            { userId });
        return response.data;
    } catch (error) {
        console.error(" Error granting project permission:", error);
        throw error;
    }

}

export const revokeProjectPermission = async (workspaceId: string,projectId: string, userId: string) => {
    try {
        const response = await axios.delete(
            PROJECT_ROUTES.revokePermission(workspaceId, projectId),
            { data: { userId } } 
        );
        return response.data;
    } catch (error) {
        console.error(" Error revoking project permission:", error);
        throw error;
    }
};




export const fetchProjectDetailService = async (workspaceId: string, projectId: string) => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/${workspaceId}/projects/detail/${projectId}`);
  return data;
};




export const fetchProjectsService = async (workspaceId: string) => {
    const { data } = await axios.get(`${BASE_URL}/workspaces/${workspaceId}/projects`);
    return data;
  };
  

  
export const fetchProjectPermissionsService = async (workspaceId: string, projectId: string) => {
    const { data } = await axios.get(`${BASE_URL}/workspaces/${workspaceId}/projects/permissions/${projectId}`);
    return data;
  };