import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeProjectPermissionService, grantProjectPermission, revokeProjectPermission } from "../../api/services/ProjectService";
import toast from "react-hot-toast";

interface ChangePermissionProps {
    workspaceId: string;
    projectId: string;
    permission: boolean;
  }
  
  interface ToggleMemberPermissionProps {
    workspaceId: string;
    projectId: string;
    userId: string;
    hasPermission: boolean;
  }
  
  export const useProjectAccessMutations = (
    workspaceId?: string,
    projectId?: string
  ) => {
    const queryClient = useQueryClient();
  
    const changePermissionMutation = useMutation({
      mutationFn: async ({ workspaceId, projectId, permission }: ChangePermissionProps) => {
        if (!workspaceId || !projectId) throw new Error("Workspace or Project ID is undefined.");
        return changeProjectPermissionService(workspaceId, projectId, permission);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project-detail", workspaceId, projectId] });
        queryClient.invalidateQueries({ queryKey: ["project-permissions", projectId] });
        toast.success("Project permission updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update access settings.");
      },
    });
  
    const toggleMemberPermissionMutation = useMutation({
      mutationFn: async ({ workspaceId, projectId, userId, hasPermission }: ToggleMemberPermissionProps) => {
        if (!workspaceId || !projectId) throw new Error("Workspace or Project ID is undefined.");
  
        if (hasPermission) {
          return revokeProjectPermission(workspaceId, projectId, userId);
        } else {
          return grantProjectPermission(workspaceId, projectId, userId);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project-permissions", projectId] });
        toast.success("Member permissions updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update member permissions.");
      },
    });
  
    return {
      changePermissionMutation,
      toggleMemberPermissionMutation,
    };
  };