import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


export const useAiRequestPermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ai_id: string) => {
      const response = await axios.post(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/add`,
        { ai_id },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: async () => {

      await queryClient.invalidateQueries({ queryKey: ["ai-permission"] });
      await queryClient.invalidateQueries({ queryKey: ["check-permission"] });

      toast.success(`คำขอใช้งาน AI ถูกส่งเรียบร้อย`);
    },
  });
};