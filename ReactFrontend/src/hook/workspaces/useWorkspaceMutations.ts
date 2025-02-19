import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  updateWorkspaceService,
  deleteWorkspaceService,
} from "../../api/services/WorkspaceService";

interface UpdateWorkspaceProps {
  workspaceId: string;
  name: string;
  description: string;
}

interface DeleteWorkspaceProps {
  workspaceId: string;
}

export const useWorkspaceMutations = (workspaceId?: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateWorkspaceMutation = useMutation({
    mutationFn: async ({ workspaceId, name, description }: UpdateWorkspaceProps) => {
      return updateWorkspaceService(workspaceId, name, description);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-detail", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["my-workspace"] });
      toast.success("Workspace updated successfully!");
      navigate("/workspaces");
    },
    onError: () => {
      toast.error("Failed to update workspace!");
    },
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: async ({ workspaceId }: DeleteWorkspaceProps) => {
      return deleteWorkspaceService(workspaceId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-workspace"] });
      navigate("/workspaces");
      toast.success("Workspace deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete workspace!");
    },
  });

  return {
    updateWorkspaceMutation,
    deleteWorkspaceMutation,
  };
};