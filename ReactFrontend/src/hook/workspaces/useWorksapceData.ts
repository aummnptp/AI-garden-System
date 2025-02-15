import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchAvailableUsersService, fetchInvitedWorkspaces, fetchInviteLinkService, fetchMembersService, fetchMyWorkspaces, fetchPendingUsersService, fetchWorkspaceDetailService } from "../../api/services/WorkspaceService";



export const useWorkspaceData  = () => {
  const { workspaceId} = useParams<{ workspaceId: string; projectId: string }>();
  const {
    data: workspaceDetail,
    isLoading: isLoadingWorkspace,
    isError: isErrorWorkspace,
  } = useQuery({
    queryKey: ["workspace-detail", workspaceId],
    queryFn: () => fetchWorkspaceDetailService(workspaceId!),
    enabled: !!workspaceId,
  });

  const {
    data: myWorkspace,
    isLoading: isLoadingMyWorkspace,
    isError: isErrorMyWorkspace,
    refetch: refetchMyWorkspace, 
  } = useQuery({
    queryKey: ["my-workspace"],
    queryFn: fetchMyWorkspaces,
  });

  const {
    data: invitedWorkspace,
    isLoading: isLoadingInvitedWorkspace,
    isError: isErrorInvitedWorkspace,
    refetch: refetchInvitedWorkspace, 
  } = useQuery({
    queryKey: ["invited-workspace"],
    queryFn: fetchInvitedWorkspaces,
  });


  const {
    data: inviteLink,
    isLoading: isLoadingInviteLink,
    isError: isErrorInviteLink,
    refetch: refetchInviteLink,
  } = useQuery({
    queryKey: ["invite-link", workspaceId],
    queryFn: () => fetchInviteLinkService(workspaceId!),
    enabled: !!workspaceId,
  });

  // ✅ Fetch Available Users
  const {
    data: userDatas,
    isLoading: isLoadingAvailableUsers,
    isError: isErrorAvailableUsers,
    refetch: refetchUserDatas,
  } = useQuery({
    queryKey: ["available-user", workspaceId],
    queryFn: () => fetchAvailableUsersService(workspaceId!),
    enabled: !!workspaceId,
  });


  const {
    data: pendingUserDatas,
    isLoading: isLoadingPendingUsers,
    isError: isErrorPendingUsers,
    refetch: refetchPendingUser,
  } = useQuery({
    queryKey: ["pending-user", workspaceId],
    queryFn: () => fetchPendingUsersService(workspaceId!),
    enabled: !!workspaceId,
  });


  const {
    data: memberDatas,
    isLoading: isLoadingMembers,
    isError: isErrorMembers,
    refetch: refetchMemberDatas,
  } = useQuery({
    queryKey: ["member-user", workspaceId],
    queryFn: () => fetchMembersService(workspaceId!),
    enabled: !!workspaceId,
  });

  return {
    workspaceDetail,
    isLoadingWorkspace,
    isErrorWorkspace,

    myWorkspace,
    isLoadingMyWorkspace,
    isErrorMyWorkspace,
    refetchMyWorkspace,

    invitedWorkspace,
    isLoadingInvitedWorkspace,
    isErrorInvitedWorkspace,
    refetchInvitedWorkspace,

    inviteLink,
    isLoadingInviteLink,
    isErrorInviteLink,
    refetchInviteLink,
    
    userDatas,
    isLoadingAvailableUsers,
    isErrorAvailableUsers,
    refetchUserDatas,

    pendingUserDatas,
    isLoadingPendingUsers,
    isErrorPendingUsers,
    refetchPendingUser,

    memberDatas,
    isLoadingMembers,
    isErrorMembers,
    refetchMemberDatas,
  };
};
