import axios from "axios";
import WORKSPACE_ROUTES from "../routes/WorkspaceRoutes";

axios.defaults.withCredentials = true;

export const updateWorkspaceService = async (workspaceId: string, name: string, description: string) => {
  try {
    const response = await axios.patch(
      `${WORKSPACE_ROUTES.updateWorkspace}${workspaceId}`,
      { name, description }
    );
    return response.data;
  } catch (error) {
    console.error(" Error updating Workspace:", error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId: string) => {
  try {
    const response = await axios.delete(`${WORKSPACE_ROUTES.deleteWorkspace}{${workspaceId}}`);
    return response.data;
  } catch (error) {
    console.error(" Error deleting Workspace:", error);
    throw error;
  }
};
