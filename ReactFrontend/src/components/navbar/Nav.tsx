import { Avatar, Button, Menu, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cookies, withCookies } from "react-cookie";
import { acceptInvitation, rejectInvitation } from "../../api/services/MemberService";
import { useFetchQuery } from "../../hook/useFetchQuery";
import { AuthContext, useAuth } from "../../context/AuthContext";
import ProfileMenu from "./ProfileMenu";
import NotificationMenu from "./NotificationTab";


function Nav() {
  const navigate = useNavigate();
  const { logout, login, user, isAuthenticated, loading } = useAuth(); // ดึง logout จาก context
  const [showNotifications, setShowNotifications] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const {
    data: notiData = [],
    refetch: refetchInvitedNotification, // <-- ดึง refetch ออกมา
  } = useFetchQuery(["invited-notification"], `/workspaces/get-my-invitation`);



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
      console.log(error);
    }
  };

  const handleReject = async (inviteId: string) => {
    try {
      await rejectInvitation(inviteId);
      refetchInvitedNotification();
    } catch (error) {
      console.log(error);
    }
  };


  const handleLogout = async () => {
    await logout(); // เรียกใช้ฟังก์ชัน logout จาก context
    navigate("/"); // ใช้ navigate เพื่อไปยังหน้าแรกหลังจาก logout
  };

  useEffect(() => {

    if (!isAuthenticated) {

    }
  }, [isAuthenticated]);

  return (
    <nav className="bg-white   w-full sticky z-20 top-0 start-0 border-b border-gray-200 ">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link to={`/`} className="">
          <a className="flex items-center space-x-3 rtl:space-x-reverse md:order-2">
            <img
              className="w-12 h-12 rounded-full  "
              src="/images/logo/IMG_3713.png"
            />
            <span className="self-center text-indigo-900 text-2xl font-semibold whitespace-nowrap ">
              AI Garden System
            </span>
          </a>
        </Link>

        <div className="flex md:order-3 space-x2 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated ? (
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

              {user && <ProfileMenu user={user} onlogout={handleLogout} />}
            </div>
          ) : (
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                },
              }}
              onClick={() => login()}
            >
              Sign In
            </Button>
          )}
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
            <li>
              <Link to={`/workspaces`} className="">
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ">
                  Workspace
                </a>
              </Link>
            </li>
            <li>
              <Link to={`/docs`} className="">
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ">
                  Document
                </a>
              </Link>
            </li>
            <li>
              <Link to={`/ai-list`}>
                <a
                  href="/ai-list"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
                >
                  AI List
                </a>
              </Link>
            </li>
            <li>
              {user?.role === "admin" && ( // แสดงปุ่มเฉพาะผู้ใช้ที่เป็น admin
                <Link to={`/admin/dashboard`} className="">
                  <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ">
                    Admin Console
                  </a>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
