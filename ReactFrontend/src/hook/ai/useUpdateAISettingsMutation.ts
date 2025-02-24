import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import { updateAISettingService } from "../../api/services/AiSettingService";

interface UpdateAISettingsProps {
  newLimit: number;
  newIsLimitEnabled: boolean;
}

export const useUpdateAISettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ newLimit, newIsLimitEnabled }: UpdateAISettingsProps) => {
      return updateAISettingService(newLimit, newIsLimitEnabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-usage-limit-setting"] });
      toast.success("AI Settings updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update AI settings.");
    },
  });
};