import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createWorkspaceService } from "../../api/services/WorkspaceService";

interface CreateWorkspaceProps {
  name: string;
  description: string;
  onSuccessCallback?: () => void;
}

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, description }: CreateWorkspaceProps) => {
      return createWorkspaceService(name, description);
    },
    onSuccess: (_data, { onSuccessCallback }) => {
      queryClient.invalidateQueries({ queryKey: ["my-workspace"] });
      toast.success("Workspace created successfully!");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error:any) => {
      const errorMessage = error.response?.data?.message || "Failed to create workspace!";
      toast.error(errorMessage);
    },
  });
};