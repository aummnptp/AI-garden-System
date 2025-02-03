import { BACKEND_API_URL } from "../../env";

const MEMBER_ROUTES = {
  pendingInvite: `${BACKEND_API_URL}/workspaces/pending-invite/`,
  confirmInvite: `${BACKEND_API_URL}`,
  cancelPending: `${BACKEND_API_URL}/workspaces/cancel-invite/`,
  removeMember: `${BACKEND_API_URL}/workspaces/remove-member/`,
  changeRole: `${BACKEND_API_URL}/workspaces/change-role/`,
  acceptInvite:`${BACKEND_API_URL}/workspaces/accept-invite/`,
  RejectInvite:`${BACKEND_API_URL}/workspaces/reject-invite/`,
  
};

export default MEMBER_ROUTES;
