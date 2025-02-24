import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const InvitePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {   
        navigate("/");
        return;
      }

      try {

        const response = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/auth/status`, { withCredentials: true });

        if (response.data.isAuthenticated) {

          await axios.post(
            `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/join-workspace`,
            { token },
            { withCredentials: true }
          );

         
          navigate("/workspaces");
        } else {
          console.warn("User not authenticated, redirecting to Google Login...");

    
          Cookies.set("redirect_after_login", `/invite?token=${token}`, { expires: 1 / 144, path: "/" }); // หมดอายุใน 10 นาที

          window.location.href = `${import.meta.env.VITE_NEST_BACKEND_API_URL}/auth/google/login`;
        }
      } catch (error) {
        navigate("/");
      }
    };

    checkAuth();
  }, [token, navigate]);

  return  <>
  <CircularProgress size={50} color="primary" />
  <Typography variant="body1" sx={{ mt: 2 }}>กรุณารอสักครู่...</Typography>
</>;;
};

export default InvitePage;
