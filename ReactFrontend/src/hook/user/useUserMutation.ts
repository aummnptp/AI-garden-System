import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
interface userDetailProps {
  userId: string;
}

export const useUserMutation = () => {
  const queryClient = useQueryClient();

  const promoteToAdminMutation = useMutation({
    mutationFn: async ({ userId }: userDetailProps) => {
      await axios.patch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/users/promote/${userId}`,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-detail"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(`เปลี่ยนผู้ใช้เป็น admin สำเร็จ`);
    },
    onError: () => {
      toast.error("คุณไม่มีสิทธิ์ในการ promote ผู้ใช้");
    },
  });
  const demoteFromAdminMutation = useMutation({
    mutationFn: async ({ userId }: userDetailProps) => {
      await axios.patch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/users/demote/${userId}`,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-detail"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(`เปลี่ยนผู้ใช้เป็น user สำเร็จ`);
    },
    onError: () => {
      toast.error("คุณไม่มีสิทธิ์ในการ demote ผู้ใช้");
    },
  });

  return {
    promoteToAdminMutation,
    demoteFromAdminMutation
  };
};