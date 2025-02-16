import axios from "axios";

import AUTH_ROUTES from "../routes/AuthRoutes";

axios.defaults.withCredentials = true;

export const logoutService = async () => {
  const response = await axios.get(
    `${AUTH_ROUTES.logout}`,
  );
  return response.data;
};

export const getSessionService = async () => {
  const response = await axios.get(`${AUTH_ROUTES.getSession}`,); 
  return response.data;

};
