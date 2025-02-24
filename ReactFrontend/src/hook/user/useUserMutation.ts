import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
        await axios.patch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/users/promote/${userId}`,
        { withCredentials: true }
      );
    },
    onSuccess: async() => {
      await queryClient.invalidateQueries({ queryKey: ["user-detail"] });
      toast.success(`เปลี่ยนผู้ใช้เป็น admin สำเร็จ`);
    },
    onError: () => {
      toast.error("เกิดข้อผิดพลาด");
    },
  });
};