import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { updateProjectService, deleteProjectService } from "../../api/services/ProjectService";
import toast from "react-hot-toast";

interface UpdateProjectProps {
  workspaceId: string;
  projectId: string;
  formData: FormData;
}

interface DeleteProjectProps {
  workspaceId: string;
  projectId: string;
}

export const useProjectMutations = (workspaceId?: string, projectId?: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateProjectMutation = useMutation({
    mutationFn: async ({ workspaceId, projectId, formData }: UpdateProjectProps) => {
      return updateProjectService({ workspaceId, projectId, formData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-detail", workspaceId, projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      toast.success("Project updated successfully!");
      navigate(`/workspaces/${workspaceId}/project-list`);
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async ({ workspaceId, projectId }: DeleteProjectProps) => {
      return deleteProjectService({ workspaceId, projectId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      toast.success("Project deleted successfully!");
      navigate(`/workspaces/${workspaceId}/project-list`);
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    },
  });

  return {
    updateProjectMutation,
    deleteProjectMutation,
  };
};