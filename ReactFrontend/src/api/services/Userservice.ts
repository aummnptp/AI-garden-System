import axios from "axios";
const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;

axios.defaults.withCredentials = true;

export const fetchMyInvitationService = async () => {
  const { data } = await axios.get(`${BASE_URL}/workspaces/get-my-invitation`);
  return data;
};
  