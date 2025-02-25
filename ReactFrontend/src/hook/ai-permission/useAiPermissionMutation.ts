import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
    revokePermissionService,
    refusePermissionService,
    approvePermissionService,
    addBulkPermissionRequestService,
    removeBulkPermissionRequestService
} from "../../api/services/AiPermissionService";

interface revokePermissionProps {
    userId: string;
    aiId: string;
}
interface permissionIdProps {
    id: string;
}
interface removeBulkPermissionRequestProps {
    userId: string;
    ids: string[];
}
interface addBulkPermissionRequestProps {
    userId: string;
    aiIds: string[];
}

export const useAiPermissionMutations = (userId?:string) => {
    const queryClient = useQueryClient();

    const approvePermissionMutation = useMutation({
        mutationFn: async ({ id }: permissionIdProps) => {
            return approvePermissionService(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["ai-permission","user"] });
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
            await queryClient.invalidateQueries({ queryKey: ["ai-permission","user"] });
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
            await queryClient.invalidateQueries({ queryKey: ["ai-approved-models","user",userId] });
            toast.success("ถอนสิทธิ์การใช้งาน AI แล้ว");
        },
        onError: () => {
            toast.error("เกิดข้อผิดพลาดในการถอนการใช้งาน AI");
        },
    });

    const addBulkPermissionRequest = useMutation({
        mutationFn: async ({ userId, aiIds }: addBulkPermissionRequestProps) => {
            return addBulkPermissionRequestService(userId, aiIds);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["ai-models-with-approval","user",userId] });
            toast.success("เพิ่มสิทธิ์การใช้งาน AI แล้ว");
        },
        onError: () => {
            toast.error("เกิดข้อผิดพลาดในเพิ่มสิทธิ์ AI");
        },
    });

    const removeBulkPermissionRequest = useMutation({
        mutationFn: async ({ userId, ids }: removeBulkPermissionRequestProps) => {
            return removeBulkPermissionRequestService(userId, ids);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["ai-models-with-approval","user",userId] });
            toast.success("ถอนสิทธิ์การใช้งาน AI แล้ว");
        },
        onError: () => {
            toast.error("เกิดข้อผิดพลาดในการถอนสิทธิ์การใช้งาน AI");
        },
    });

    return {
        approvePermissionMutation,
        refusePermissionMutation,
        revokePermissionMutation,
        addBulkPermissionRequest,
        removeBulkPermissionRequest
    };
};