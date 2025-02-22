
import { useQuery } from "@tanstack/react-query";

import { fetchMyInvitationService, fetchUserWithPermissionAndWorkspaceCountService } from "../../api/services/Userservice";


export const useUserData = () => {
  // const { workspaceId, projectId,historyId } = useParams<{ workspaceId: string; projectId: string; historyId:string}>();
  const {
    data: userData = [] ,  
    isLoading: isLoadingUserData,
    isError: isErrorUserData,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUserWithPermissionAndWorkspaceCountService(),
  });

  //My Invitation
  const {
    data: notiData = [] ,  
    isLoading: isLoadingInvitedNotification,
    isError: isErrorInvitedNotification,
    refetch: refetchInvitedNotification,
  } = useQuery({
    queryKey: ["my-invitation-notification"],
    queryFn: () => fetchMyInvitationService(),
  });


 
  return {
    userData,  
    isLoadingUserData,
    isErrorUserData,
    refetchUserData,

    notiData,  
    isLoadingInvitedNotification,
    isErrorInvitedNotification,
    refetchInvitedNotification,

  };
};
