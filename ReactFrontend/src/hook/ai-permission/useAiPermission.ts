import { useQuery } from "@tanstack/react-query";
import {
    fetchPermissionDetailService
} from "../../api/services/AiPermissionService";

export const useAiPermission = () => {
    const {
        data: PermissionData = [],
    } = useQuery({
        queryKey: ["ai-permission"],
        queryFn: () => fetchPermissionDetailService(),
    });

    return {
        PermissionData,
    };
};