import axios from "axios";
import WORKSPACE_ROUTES from "../routes/WorkspaceRoutes";
const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;

axios.defaults.withCredentials = true;

export const updateWorkspaceService = async (workspaceId: string, name: string, description: string) => {
    const response = await axios.patch(
      `${WORKSPACE_ROUTES.updateWorkspace}${workspaceId}`,
      { name, description }
    );
    return response.data;
};

export const createWorkspaceService = async (name: string, description: string) => {
  const response = await axios.post(`${BASE_URL}/workspaces/create`, { name, description }, { withCredentials: true });
  return response.data;
};

export const deleteWorkspaceService = async (workspaceId: string) => {
    const response = await axios.delete(`${WORKSPACE_ROUTES.deleteWorkspace}{${workspaceId}}`);
    return response.data;
};


export const fetchWorkspaceDetailService = async (workspaceId: string) => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/detail/${workspaceId}`);
  return data;
};

export const fetchMyWorkspaces = async () => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/my-workspaces`);
  return data;
};

export const fetchInvitedWorkspaces = async () => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/invite-workspaces`);
  return data;
};

export const fetchInviteLinkService = async (workspaceId: string) => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/generate-invite/${workspaceId}`);
  return data;
};

export const fetchAvailableUsersService = async (workspaceId: string) => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/available-users/${workspaceId}`);
  return data;
};

export const fetchPendingUsersService = async (workspaceId: string) => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/pending-users/${workspaceId}`);
  return data;
};

export const fetchMembersService = async (workspaceId: string) => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/members-profiles/${workspaceId}`);
  return data;
};

export const fetchPersonalWorkspaceService = async (userId: string) => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/personal/${userId}`);
  return data;
};