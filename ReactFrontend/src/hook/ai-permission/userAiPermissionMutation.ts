import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
    revokePermissionService,
    refusePermissionService,
    approvePermissionService
} from "../../api/services/AiPermissionService";

interface revokePermissionProps {
    userId: string;
    aiId: string;
}
interface permissionIdProps {
    id: string;
}


export const useAiPermissionMutations = () => {
    const queryClient = useQueryClient();

    const approvePermissionMutation = useMutation({
        mutationFn: async ({ id }: permissionIdProps) => {
            return approvePermissionService(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["ai-permission"] });
            toast.success("ยอมรับคำขอใช้งาน AI แล้ว");
        },
        onError: () => {
            toast.error("เกิดข้อผิดพลาดในการยอมรับคำขอใช้งาน AI");
        },
    });

    const refusePermissionMutation = useMutation({
        mutationFn: async ({ id }: permissionIdProps) => {
            return refusePermissionService(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["ai-permission"] });
            toast.success("ปฏิเสธคำขอใช้งาน AI แล้ว");
        },
        onError: () => {
            toast.error("เกิดข้อผิดพลาดในการปฏิเสธคำขอใช้งาน AI");
        },
    });

    const revokePermissionMutation = useMutation({
        mutationFn: async ({ userId, aiId }: revokePermissionProps) => {
            return revokePermissionService(userId, aiId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["ai-permission"] });
            toast.success("ถอนสิทธิ์การใช้งาน AI แล้ว");
        },
        onError: () => {
            toast.error("เกิดข้อผิดพลาดในการถอนการใช้งาน AI");
        },
    });

    return {
        approvePermissionMutation,
        refusePermissionMutation,
        revokePermissionMutation
    };
};