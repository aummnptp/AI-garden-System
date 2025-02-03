import axios from "axios";

import AUTH_ROUTES from "../routes/AuthRoutes";

axios.defaults.withCredentials = true;

const logoutService = async () => {
  try {
    const response = await axios.get(
      `${AUTH_ROUTES.logout}`,
  
    );
    return response.data; 
  } catch (error) {
    console.error("Error logout", error);
    throw error;
  }
};

const getSessionService = async () => {
    try {
      const response = await axios.get(
        `${AUTH_ROUTES.getSession}`,
    
      );
      return response.data; 
    } catch (error) {
      console.error("Error get session", error);
      throw error;
    }
  };
export {logoutService,getSessionService};