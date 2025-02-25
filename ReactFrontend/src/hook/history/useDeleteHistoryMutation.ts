import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHistoryService } from "../../api/services/HistoryService";
import { toast } from "react-hot-toast";

interface DeleteHistoryProps {
  workspaceId: string;
  projectId: string;
  historyId: string;
}

export const useDeleteHistoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, projectId, historyId }: DeleteHistoryProps) => {
      return deleteHistoryService(workspaceId, projectId, historyId);
    },
    onSuccess: (_data, { workspaceId, projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["all-history-project", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["project-history", workspaceId, projectId] });
      toast.success("History deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete history!");
    },
  });
};