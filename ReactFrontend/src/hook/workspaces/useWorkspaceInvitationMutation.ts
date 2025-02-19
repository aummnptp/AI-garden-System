import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import {
  pendingInviteMember,
  removeMember,
  cancelPendingInvite,
  changeMemberRole,
} from "../../api/services/MemberService";
import { userData } from "../../types/Invitation";

interface InviteMemberProps {
  workspaceId: string;
  selectedUsers: userData[];
  onSuccessCallback?: () => void;
}

interface RemoveMemberProps {
  workspaceId: string;
  userId: string;
}

interface CancelPendingProps {
  workspaceId: string;
  inviteId: string;
}

interface ChangeRoleProps {
  workspaceId: string;
  memberId: string;
  newRole: string;
}

export const useWorkspaceInvitationMutation = () => {
  const queryClient = useQueryClient();

  const inviteMembers = useMutation({
    mutationFn: ({ workspaceId, selectedUsers }: InviteMemberProps) =>
      pendingInviteMember(workspaceId, selectedUsers),
    onSuccess: (_data, { workspaceId, onSuccessCallback }) => {
      queryClient.invalidateQueries({ queryKey: ["available-user", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["pending-user", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["member-user", workspaceId] });
      toast.success("Members invited successfully!");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      console.error("Error inviting members:", error);
      toast.error("Failed to invite members!");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ workspaceId, userId }: RemoveMemberProps) =>
      removeMember(workspaceId, userId),
    onSuccess: (_data, { workspaceId }) => {
        queryClient.invalidateQueries({ queryKey: ["available-user", workspaceId] });
        queryClient.invalidateQueries({ queryKey: ["pending-user", workspaceId] });
        queryClient.invalidateQueries({ queryKey: ["member-user", workspaceId] });
      toast.success("Member removed successfully!");
    },
    onError: (error) => {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member!");
    },
  });

  // 3. ยกเลิกคำเชิญที่รอการตอบรับ
  const cancelPendingMutation = useMutation({
    mutationFn: ({ workspaceId, inviteId }: CancelPendingProps) =>
      cancelPendingInvite(workspaceId, inviteId),
    onSuccess: (_data, { workspaceId }) => {
        queryClient.invalidateQueries({ queryKey: ["available-user", workspaceId] });
        queryClient.invalidateQueries({ queryKey: ["pending-user", workspaceId] });
        queryClient.invalidateQueries({ queryKey: ["member-user", workspaceId] });
      toast.success("Pending invite canceled!");
    },
    onError: (error) => {
      console.error("Error canceling invite:", error);
      toast.error("Failed to cancel invite!");
    },
  });

  // 4. เปลี่ยนบทบาทของสมาชิก
  const changeRoleMutation = useMutation({
    mutationFn: ({ workspaceId, memberId, newRole }: ChangeRoleProps) =>
      changeMemberRole(workspaceId, memberId, newRole),
    onSuccess: (_data, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ["member-user", workspaceId] });
      toast.success("Member role updated!");
    },
    onError: (error) => {
      console.error("Error changing member role:", error);
      toast.error("Failed to change role!");
    },
  });

  return {
    inviteMembers: inviteMembers.mutate,
    removeMember: removeMemberMutation.mutate,
    cancelPending: cancelPendingMutation.mutate,
    changeRole: changeRoleMutation.mutate,
  };
};