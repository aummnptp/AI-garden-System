import axios from "axios";
import MEMBER_ROUTES from "../routes/MemberRoutes";

axios.defaults.withCredentials = true;

const pendingInviteMember = async (workspaceId: string,selectedUsers:{email:string}[]) => {
    if (selectedUsers.length === 0){
        throw new Error("Please select at least one user to invite.")
    }
    const requestBody = {
        emails: selectedUsers.map((user) => user.email),
      };
    
      try {
        const response = await axios.post(
          `${MEMBER_ROUTES.pendingInvite}${workspaceId}`,
          requestBody
        );
        return response.data;
      } catch (error) {
        console.error("Error sending invites:", error);
        throw error; 
      }
};

const cancelPendingInvite = async (workspaceId: string, inviteId: string) => {
    const requestBody = {
        inviteId: inviteId,
    };
    try {
        const response = await axios.delete(
            `${MEMBER_ROUTES.cancelPending}${workspaceId}`,
            { data: requestBody }
        );
        
        return response.data;
    } catch (error) {
        console.error("Error canceling invite:", error);
        throw error;
    }
};

const removeMember = async (workspaceId: string, userId: string) => {
    const requestBody = {
        userId: userId,
    };
    try {
        const response = await axios.delete(
            `${MEMBER_ROUTES.removeMember}${workspaceId}`,
            { data: requestBody }
        );
        
        return response.data;
    } catch (error) {
        console.error("Error canceling invite:", error);
        throw error;
    }
};

const changeMemberRole = async (workspaceId: string, userId: string, newRole:string) => {
    const requestBody = {
        userId:userId,
        role: newRole, 
    };
    try {
        const response = await axios.patch(
            `${MEMBER_ROUTES.changeRole}${workspaceId}`,
            { data: requestBody }
        );
        
        return response.data;
    } catch (error) {
        console.error("Error canceling invite:", error);
        throw error;
    }
};


export { pendingInviteMember,cancelPendingInvite,removeMember,changeMemberRole};