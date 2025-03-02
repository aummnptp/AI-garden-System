import { Button, CircularProgress } from "@mui/material";

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  acceptInvitation,
  rejectInvitation,
} from "../../api/services/MemberService";

import { useAuth } from "../../context/AuthContext";
import ProfileMenu from "./ProfileMenu";
import NotificationMenu from "./NotificationTab";
import { useUserData } from "../../hook/user/useUserData";
import LoadingSpinner from "../LoadingSpinner";

function Nav() {
  const navigate = useNavigate();
  const { logout, login, user, isAuthenticated, loading, isAdmin } = useAuth(); // ดึง logout จาก context
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const {
    notiData,
    isLoadingInvitedNotification,
    refetchInvitedNotification,
  } = useUserData();

  const toggleNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseNoti = () => {
    setAnchorEl(null);
  };

  const handleAccept = async (inviteId: string) => {
    try {
      await acceptInvitation(inviteId);
      refetchInvitedNotification();
    } catch (error) {
    }
  };

  const handleReject = async (inviteId: string) => {
    try {
      await rejectInvitation(inviteId);
      refetchInvitedNotification();
    } catch (error) {
    }
  };

  const handleLogout = async () => {
    await logout();
    
    navigate("/");
  };

  useEffect(() => {
    if (!isAuthenticated) {
    }
  }, [isAuthenticated]);

  if (isLoadingInvitedNotification) 
  return   <nav className="bg-white w-full sticky z-20 top-0 start-0 border-b border-gray-200">
    <LoadingSpinner/></nav>;


  return (
    <nav className="bg-white w-full sticky z-20 top-0 start-0 border-b border-gray-200">
      <div className="w-full flex items-center justify-between mx-auto p-4">
        {/* กลุ่ม Logo และ Navigation */}
        <div className="flex items-center gap-x-6">
          <Link to={`/`}>
            <div className="flex items-center space-x-3">
              <img
                className="w-12 h-12 rounded-full"
                src="/images/logo/IMG_3713.png"
              />
              <span className="self-center text-indigo-900 text-2xl font-semibold whitespace-nowrap">
                AI Garden System
              </span>
            </div>
          </Link>

          {/* เมนูหลักรวม Document ไว้ด้วย */}
          <ul className="flex items-center space-x-6">
            {user && (
              <>
                   <li>
              <Link
                to={`/docs`}
                className="text-gray-900 font-medium hover:text-blue-700"
              >
                Document
              </Link>
            </li>
                <li>
                  <Link
                    to={`/workspaces`}
                    className="text-gray-900 font-medium hover:text-blue-700"
                  >
                    Workspace
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/ai-list`}
                    className="text-gray-900 font-medium hover:text-blue-700"
                  >
                    AI List
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      to={`/admin/dashboard`}
                      className="text-gray-900 font-medium hover:text-blue-700"
                    >
                      Admin Console
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* เมนูผู้ใช้ / Sign In */}
        <div className="flex md:order-3">
          {loading ? (
            <CircularProgress size={24} />
          ) : isAuthenticated ? (
            <div className="flex relative">
              <NotificationMenu
                notiData={notiData}
                open={open}
                anchorEl={anchorEl}
                toggleNotifications={toggleNotifications}
                handleCloseNoti={handleCloseNoti}
                handleAccept={handleAccept}
                handleReject={handleReject}
              />
              {user ? (
                <ProfileMenu user={user} onlogout={handleLogout} />
              ) : null}
            </div>
          ) : (
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": { backgroundColor: "#3730a3" },
              }}
              onClick={() => login()}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
