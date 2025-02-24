
import { useQuery } from "@tanstack/react-query";

import { fetchMyInvitationService, fetchUserWithPermissionAndWorkspaceCountService, fetchUserDetail } from "../../api/services/Userservice";
import { useParams } from "react-router-dom";


export const useUserData = () => {
  const { userId } = useParams<{ userId: string}>();
  const {
    data: userData = [] ,  
    isLoading: isLoadingUserData,
    isError: isErrorUserData,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUserWithPermissionAndWorkspaceCountService(),
  });

  const {
    data: userDetailById,  
    isLoading: isLoadinguserDetailById,
    isError: isErroruserDetailById,
    refetch: refetchuserDetailById,
  } = useQuery({
    queryKey: ["user-detail", userId],
    queryFn: () => fetchUserDetail(userId!),
        enabled: !!userId,
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

    userDetailById ,  
    isLoadinguserDetailById,
    isErroruserDetailById,
    refetchuserDetailById,

    notiData,  
    isLoadingInvitedNotification,
    isErrorInvitedNotification,
    refetchInvitedNotification,

  };
};
