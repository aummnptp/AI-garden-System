
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchMyInvitationService } from "../../api/services/Userservice";


export const useUserData = () => {
  // const { workspaceId, projectId,historyId } = useParams<{ workspaceId: string; projectId: string; historyId:string}>();

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

    notiData,  
    isLoadingInvitedNotification,
    isErrorInvitedNotification,
    refetchInvitedNotification,

  };
};
