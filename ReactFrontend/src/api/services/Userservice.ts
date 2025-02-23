import axios from "axios";
const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;

axios.defaults.withCredentials = true;

export const fetchUserService = async () => {
  const { data } = await axios.get(`${BASE_URL}/users`);
  return data;
};

export const fetchUserWithPermissionAndWorkspaceCountService = async () => {
  try {
    // ดึงข้อมูลผู้ใช้
    const { data: users } = await axios.get(`${BASE_URL}/users`);
    // รวมข้อมูล approvedCount และ workspaceCount สำหรับแต่ละผู้ใช้
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
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchUserDetail = async (userId: string) => {
  const { data } = await axios.get(`${BASE_URL}/users/${userId}`);
  return data;
};

export const fetchMyInvitationService = async () => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/get-my-invitation`);
  return data;
};