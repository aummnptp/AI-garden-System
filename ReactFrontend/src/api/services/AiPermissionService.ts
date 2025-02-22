import axios from "axios";
const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;

axios.defaults.withCredentials = true;

export const approvePermissionService = async (id: string) => {
    try {
        await axios.patch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/${id}/approve`)
    } catch (error) {
        console.error('ไม่สามารถยอมรับคำขอได้:', error);
    }
};

export const refusePermissionService = async (id: string) => {
    try {
        await axios.delete(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/${id}`)
    } catch (error) {
        console.error('ไม่สามารถปฏิเสธตำขอได้:', error);
    }
};

export const revokePermissionService = async (userId: string, aiId: string) => {
    try {
        await axios.delete(
            `${BASE_URL}/ai-permission/user/${userId}/ai/${aiId}`,
        );
    } catch (error) {
        console.error('ไม่สามารถถอนสิทธิ์ได้:', error);
    }
};