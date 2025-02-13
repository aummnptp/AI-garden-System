import { BACKEND_API_URL } from "../../env";

const WORKSPACE_ROUTES = {
  updateWorkspace: `${BACKEND_API_URL}/workspaces/update/`,
  deleteWorkspace: `${BACKEND_API_URL}/workspaces/delete/`,
};

export default WORKSPACE_ROUTES;