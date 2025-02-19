import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";

interface CreateWorkspaceProps {
  name: string;
  description: string;
  onSuccessCallback?: () => void;
}

const createWorkspaceService = async ({ name, description }: CreateWorkspaceProps) => {
  return axios.post(
    `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/create`,
    { name, description },
    { withCredentials: true }
  );
};

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspaceService,
    onSuccess: (_data, { onSuccessCallback }) => {
      queryClient.invalidateQueries({ queryKey: ["my-workspace"] });
      toast.success("Workspace created successfully!");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      console.error("Error creating workspace:", error);
      toast.error("Failed to create workspace!");
    },
  });
};