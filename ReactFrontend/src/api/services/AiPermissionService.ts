import axios from "axios";
const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;

axios.defaults.withCredentials = true;

export const fetchCheckPermissionService = async (ai_id: string) => {
    const { data } = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/check/${ai_id}`)
    return data;
};

export const fetchPermissionDetailService = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/detail`)
    return data;
};

export const approvePermissionService = async (id: string) => {
    try {
        await axios.patch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/${id}/approve`)
    } catch (error) {
    }
};

export const refusePermissionService = async (id: string) => {
    try {
        await axios.delete(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/${id}`)
    } catch (error) {
    }
};

export const revokePermissionService = async (userId: string, aiId: string) => {
    try {
        await axios.delete(
            `${BASE_URL}/ai-permission/user/${userId}/ai/${aiId}`,
        );
    } catch (error) {
    }
};

export const addBulkPermissionRequestService = async (userId: string, aiIds: string[]) => {
    const { data } = await axios.post(`${BASE_URL}/ai-permission/add-bulk/${userId}`, { aiIds });
    return data;
};

export const removeBulkPermissionRequestService = async (userId: string, ids: string[]) => {
    const { data } = await axios.delete(`${BASE_URL}/ai-permission/remove-bulk/${userId}`, {
        data: { ids },
      });
    return data;
};