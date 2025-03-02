import axios from "axios";
const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;

axios.defaults.withCredentials = true;

export const fetchUserService = async () => {
  const { data } = await axios.get(`${BASE_URL}/users`);
  return data;
};

export const fetchUserWithPermissionAndWorkspaceCountService = async () => {
  try {
    const { data: users } = await axios.get(`${BASE_URL}/users`);
    const usersWithCounts = await Promise.all(
      users.map(async (user: any) => {
        const { data: approvedData } = await axios.get(
          `${BASE_URL}/ai-permission/count-approved/${user.userId}`
        );
        const { data: workspaceData } = await axios.get(
          `${BASE_URL}/workspaces/count/${user.userId}`
        );
        return {
          ...user,
          approvedCount: approvedData.approvedCount,
          workspaceCount: workspaceData.workspaceCount,
        };
      })
    );
    return usersWithCounts;
  } catch (error) {
    throw error;
  }
};

export const fetchUserDetail = async (userId: string) => {
  const { data } = await axios.get(`${BASE_URL}/users/get-user/${userId}`);
  return data;
};

export const fetchMyInvitationService = async () => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/get-my-invitation`);
  return data;
};