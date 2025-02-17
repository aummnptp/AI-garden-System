import { useEffect, useState } from 'react';
import MiniFooter from '../../components/MiniFooter';
import AdminSidebar from '../../components/AdminSidebar';
import { Link, useParams } from 'react-router-dom';
import AiApprovedListTable from '../../components/table/AiApprovedListTable';
import axios from 'axios';

import WorkspaceCard from '../../components/card/WorkspaceCard';
import AddAIDialog from '../../components/AddAIDialog';
import { Workspace } from '../../types/Workspace';
import { Button } from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';

const UserDetailPage = () => {
  const { userId } = useParams();
  const [userTab, setUserTab] = useState<string>("Ai");
  const [userData, setUserData] = useState<any>(null);
  const [myWorkspace, setMyWorkspace] = useState([]);
  const [aiCount, setAiCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/users/${userId}`, {
        withCredentials: true,
      })
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error('❌ Error fetching user data:', error);
        });

      axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${userId}/models`)
        .then((response) => {
          const approvedAiCount = response.data.filter((ai: any) =>
            ai.permissions.some((permission: any) => permission.approve)
          ).length;
          setAiCount(approvedAiCount);
        })
        .catch((error) => {
          console.error('❌ Error fetching AI models:', error);
        });
    }
  }, [userId]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/personal/${userId}`, {
      withCredentials: true,
    })
      .then((response) => {
        setMyWorkspace(response.data);
      })
      .catch((error) => {
        console.error('❌ Error fetching workspace data:', error);
      });
  }, [userData]);

  const handlePromoteToAdmin = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      await axios.patch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/users/promote/${userId}`, {}, {
        withCredentials: true,
      });

      alert(`✅ ${userData?.name} ได้รับสิทธิ์เป็น Admin เรียบร้อยแล้ว!`);

      // อัปเดต role ของ userData หลังจาก Promote สำเร็จ
      setUserData((prevData: any) => ({
        ...prevData,
        role: "admin",
      }));
    } catch (error) {
      console.error('❌ Error promoting user:', error);
      alert("❌ ไม่สามารถอัปเกรดเป็น Admin ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <AdminSidebar />

        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] relative">
            {/* 🔵 Promote to Admin Button (มุมขวาบน) */}


            {/* Header: User Profile */}
            <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-[15px] text-white h-28">
              <img
                className="absolute w-32 h-32 rounded-full border-4 border-white top-[52px] left-6"
                src={userData?.picture || "/images/default-profile.png"} // ✅ ถ้าไม่มีรูปให้ใช้ default
                alt="User"
              />
            </div>
            <div className="absolute top-5 right-5">
              <Button
                onClick={handlePromoteToAdmin}
                variant="outlined"
                sx={{
                  background: 'white',
                  borderColor: "#4f46e5", // กรอบสีน้ำเงิน
                  color: "#4f46e5", // ตัวหนังสือสีน้ำเงิน
                  "&:hover": {
                    borderColor: "#3730a3", // กรอบเข้มขึ้นเมื่อ hover
                    backgroundColor: "rgba(79, 70, 229, 0.1)" // สีพื้นหลังบาง ๆ เมื่อนำเมาส์ไปวาง
                  }
                }}
                disabled={userData?.role === "admin" || loading}
                startIcon={<AdminPanelSettings />}
              >
                {userData?.role === "admin" ? "เป็น Admin แล้ว" : "Promote เป็น Admin"}
              </Button>

            </div>

            <div className="ml-6 mt-20">
              {userData ? (
                <>
                  <h2 className="text-3xl font-semibold">
                    <i className="bi bi-person-circle"></i> {userData.name}
                  </h2>
                  <p className="text-xl text-blue-500">
                    <i className="bi bi-envelope"></i> : {userData.email || "N/A"}
                  </p>
                  
                </>
              ) : (
                <p className="text-gray-500">กำลังโหลดข้อมูลผู้ใช้...</p>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-6 flex justify-start px-6 ">
              <a
                onClick={() => setUserTab("Ai")}
                className={`w-[50%] border-b-2 inline-block rounded-t-lg cursor-pointer px-4 py-2 text-center font-medium ${userTab === "Ai"
                  ? "text-indigo-600 border-indigo-600"
                  : "border-transparent text-gray-600 hover:border-gray-300"
                  }`}
              >
                <i className="bi bi-card-list"></i> รายชื่อสิทธิ์ AI
              </a>

              <a
                onClick={() => setUserTab("Workspace")}
                className={`w-[50%] border-b-2 inline-block rounded-t-lg cursor-pointer px-4 py-2 text-center font-medium ${userTab === "Workspace"
                  ? "text-indigo-600 border-indigo-600"
                  : "border-transparent text-gray-600 hover:border-gray-300"
                  }`}
              >
                <i className="bi bi-laptop"></i> Workspace
              </a>
            </div>

            <div className='py-6 border-t'>
              {userTab === "Ai" ? (
                <div className="px-6">
                  <div className="flex justify-between items-center px-4 py-2 ">
                    <span className='text-xl font-medium text-indigo-800'>
                      <i className="bi bi-file-earmark-check-fill"></i> AI ได้รับสิทธิ์ : {aiCount}
                    </span>
                    <AddAIDialog />
                  </div>
                  <AiApprovedListTable userId={userId} />
                </div>
              ) : userTab === "Workspace" ? (
                <div className={`grid grid-cols-3 pb-8 pt-2`}>
                  {myWorkspace.length > 0 ? myWorkspace.map((data: Workspace, index) => (
                    <div key={index} className={`mb-4`}>
                      <Link to={`/workspaces/${data.workspaceId}/project-list`}>
                        <WorkspaceCard {...data} />
                      </Link>
                    </div>
                  )) : (
                    <div className="text-center py-6 text-gray-500 text-xl">
                      <i className="bi bi-folder-x"></i> ไม่พบข้อมูล Workspace
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <MiniFooter />
    </>
  );
};

export default UserDetailPage;
