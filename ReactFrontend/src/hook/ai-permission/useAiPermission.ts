import { useQuery } from "@tanstack/react-query";
import {
    fetchPermissionDetailService
} from "../../api/services/AiPermissionService";

export const useAiPermission = () => {
    const {
        data: PermissionData = [],
    } = useQuery({
        queryKey: ["ai-permisision"],
        queryFn: () => fetchPermissionDetailService(),
    });

    return {
        PermissionData,
    };
};