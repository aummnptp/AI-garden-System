import { BACKEND_API_URL } from "../../env";

const AUTH_ROUTES = {
  login: `${BACKEND_API_URL}/auth/google/login`,
  logout: `${BACKEND_API_URL}/auth/logout`,
  getSession: `${BACKEND_API_URL}/users/profile`,
};

export default AUTH_ROUTES;
