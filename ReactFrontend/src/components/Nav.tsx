

import { Button } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';


interface NotiData {
  id: number;
  firstName: string;
  lastName: string;
  workspace: string;
}
function Nav() {
  const [notiData, setNotiData] = useState<NotiData[]>([
    {
      id: 1,
      firstName: "Putthipong",
      lastName: "Chobngam",
      workspace: "Project 67",
     
    },
    {
      id: 2,
      firstName: "Apple",
      lastName: "Banana",
      workspace: "KMITL",
      
    },
    {
      id: 3,
      firstName: "Apple",
      lastName: "Banana",
      workspace: "KMITL",
      
    },
   

 
  ]);
  const [isLogin ,setIsLogin] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);
  
  const handleAccept = (index:number) => {
    const UpdatedNoti = [...notiData];
    UpdatedNoti.splice(index, 1);
    setNotiData(UpdatedNoti)

  };

  return (
    <nav className="bg-white   w-full sticky z-20 top-0 start-0 border-b border-gray-200 ">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
      <Link to={`/`} className="">
        <a
         
          className="flex items-center space-x-3 rtl:space-x-reverse md:order-2"
        >
          <img
            className="w-10 h-10 rounded-full  "
            src="/images/logo/navlogo.png"
          />
          <span className="self-center text-indigo-900 text-2xl font-semibold whitespace-nowrap ">
            AI Garden System
          </span>
        </a>
<<<<<<< Updated upstream
        </Link>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-3">
        <Link to={`/admin/dashboard`} className="">
=======
        
        
        <div className="flex md:order-3 space-x2 md:space-x-0 rtl:space-x-reverse">
>>>>>>> Stashed changes
          <a
          
            className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
          >
            Admin Console
          </a>
          </Link>
        </div>

        <div className="flex md:order-3 space-x2 md:space-x-0 rtl:space-x-reverse">
          {isLogin ? (
            <div className="flex relative">
              <div
                className="relative flex items-center p-4 ml-3 hover:bg-gray-100 cursor-pointer rounded-lg hover:text-blue-700"
                onClick={toggleNotifications}
              >
                <i className="bi bi-bell-fill"></i>
                <span className="ml-2">Notificaton</span>
                {notiData.length > 0 && (
            <span className="absolute top-3 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
              {notiData.length}
            </span>
          )}
 
              </div>
              {showNotifications && (
                <div
                  ref={modalRef}
                  className="absolute right-0 mt-1 w-80 bg-white shadow-lg rounded-lg transition-transform transform translate-y-2"
                  style={{
                    top: 'calc(100% + 8px)', // ให้โมดัลอยู่ข้างล่างปุ่มห่าง 8px
                    left: '50%',             // จัดตำแหน่งให้อยู่ตรงกลางปุ่ม
                    transform: 'translateX(-50%)', // ทำให้โมดัลตรงกับปุ่มแบบสมบูรณ์
                  }}>
                  <div className="p-4 border-b ">Notificaton</div>
                  <div className="max-h-64 overflow-y-auto">
                    {/* noti map here */}
                    {notiData.length > 0 ? (
    <div className="max-h-64 overflow-y-auto">
      {notiData.map((noti, index) => (
        <div
          key={index}
          className="flex items-center w-fit ml-3 p-2 bg-rd"
        >
          <img
            className="w-10 h-10 rounded-full border-2"
            src="/images/homeImage/profile.webp"
          />
          <div className="ml-2">
            <span className="text-black text-lg font-medium">
              {noti.firstName} {noti.lastName}
            </span>
            <br />
            <span className="text-black text-base font-normal">
              {" "}ได้เชิญคุณเข้าร่วม
            </span>
            <span className="text-black text-lg font-medium">
              {" "}{noti.workspace}
            </span>
            <div className="w-full">
              <Button
                onClick={() => handleAccept(index)}
                variant="contained"
                color="success"
                style={{ marginRight: '8px' }}
                size="small"
              >
                ยอมรับ
              </Button>
              <Button 
               onClick={() => handleAccept(index)}
              variant="outlined" color="error" size="small">ปฎิเสธ</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="p-4 text-center text-gray-500">
      ไม่มีการแจ้งเตือน
    </div>
  )}
                  </div>
                </div>
              )}
              <div
                className="flex items-center w-fit ml-3 hover:bg-gray-100 p-2 cursor-pointer
                rounded-lg"
              >
                <img
                  className="w-10 h-10 rounded-full border-2"
                  src="/images/homeImage/profile.webp"
                />
                <div className="ml-2">
                  <text className="text-black text-lg font-normal">
                    Kittinana
                  </text>
                </div>
              </div>
            </div>
          ) : (
            <a
              href="#"
              type="button"
              className="text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[15px] text-sm px-4 py-2 text-center "
            >
              Sign In
            </a>
          )}
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
            <li>
            <Link to={`/workspaces`} className="">
              <a
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
              >
                Workspace
              </a>
              </Link>
            </li>
            <li>
            <Link to={`/docs`} className="">
              <a

                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
              >
                Document
              </a>
              </Link>
            </li>
            <li>
              <Link  to={`/ai-list`}>
              <a
                href="/ai-list"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
                >
                AI List
              </a>
              </Link>
            </li>
            <li>
              <a
                href="/admin"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Admin Console
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
