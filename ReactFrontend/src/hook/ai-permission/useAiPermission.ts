import { useQuery } from "@tanstack/react-query";
import {
    fetchPermissionDetailService,
    fetchCheckPermissionService
} from "../../api/services/AiPermissionService";
import { useParams } from "react-router-dom";

export const useAiPermission = () => {
    const { ai_id } = useParams<{ ai_id:string}>();
    const {
        data: PermissionData = [],
    } = useQuery({
        queryKey: ["ai-permission"],
        queryFn: () => fetchPermissionDetailService(),
    });

    const {
        data: checkPermission,
    } = useQuery({
        queryKey: ["check-permission", ai_id],
        queryFn: () => fetchCheckPermissionService(ai_id!),
        enabled: !!ai_id, 
    });

    return {
        PermissionData,
        checkPermission
    };
};