import React, { useEffect, useState } from 'react'
import MiniFooter from '../../components/MiniFooter'
import AdminSidebar from '../../components/AdminSidebar'
import { Link, useParams } from 'react-router-dom';
import AiApprovedListTable from '../../components/table/AiApprovedListTable';
import axios from 'axios';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import WorkspaceCard from '../../components/card/WorkspaceCard';
import AddAIDialog from '../../components/AddAIDialog';

const UserDetailPage = () => {

  const [userTab, setUserTab] = useState<string>("Ai");


  const fetchWorkspaces = () => {
    axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/`)
      .then(response => {
        setMyWorkspace(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the workspace data!", error);
      });
  };

  const { userId } = useParams<{ userId?: string }>();
  const [userData, setUserData] = useState<any>();
  const [myWorkspace, setMyWorkspace] = useState([]);
  useEffect(() => {
    if (userId) {
      axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/users/${userId}`, {
        withCredentials: true, 
      })
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the AI data!', error);
        });
    }
  }, [userId]);

  useEffect(() => {

    axios
      .get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${userId}`, {
        withCredentials: true, 
      })
      .then((response) => {
        console.log('Workspace data:', response.data); // ตรวจสอบข้อมูลที่ได้
        setMyWorkspace(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the workspace data!', error);
      });

  }, [userData]);
  return (
    <>
      <div className=" flex h-full min-h-screen bg-neutral-100">
        <AdminSidebar></AdminSidebar>
        {/* top card (create sort workspace name) */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">



          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
            {/* Header: User Profile */}
            <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-[15px] text-white h-28">
              <img
                className="absolute w-32 h-32 rounded-full border-4 border-white top-[52px] left-6"
                src="/images/homeImage/profile.webp" // ใช้รูปภาพผู้ใช้จริง
                alt="User"
              />
            </div>

            <div className="ml-6 mt-20">
              {/* ตรวจสอบว่า userData มีค่าแล้วก่อนเข้าถึงข้อมูล */}
              {userData ? (
                <>
                  <h2 className="text-3xl font-semibold">
                    <i className="bi bi-person-circle"></i> {userData.name}
                  </h2>
                  <p className="text-xl text-blue-500">
                    <i className="bi bi-envelope"></i> : {userData.email || "N/A"}
                  </p>
                  <p className="text-sm mt-1 text-gray-500">User since 1/9/24</p>
                </>
              ) : (
                <p className="text-gray-500">กำลังโหลดข้อมูลผู้ใช้...</p>
              )}
            </div>
            {/* Tabs */}
            <div className="mt-6 flex justify-start px-6 ">
              <a
                onClick={() => setUserTab("Ai")}
                className={`w-[50%]  border-b-2   inline-block  rounded-t-lg cursor-pointer px-4 py-2 text-center font-medium  ${userTab === "Ai"
                  ? "text-indigo-600 border-indigo-600  "
                  : " border-transparent text-gray-600 hover:border-gray-300"
                  }`}
              >
                <i className="bi bi-card-list"></i> รายชื่อสิทธิ์ AI
              </a>

              <a
                onClick={() => setUserTab("Workspace")}
                className={`w-[50%]  border-b-2   inline-block  rounded-t-lg cursor-pointer px-4 py-2 text-center font-medium ${userTab === "Workspace"
                  ? "text-indigo-600 border-indigo-600"
                  : "  border-transparent text-gray-600  hover:border-gray-300"
                  }`}
              >
                <i className="bi bi-laptop"></i> Workspace
              </a>
            </div>
            <div className=' py-6 border-t'>
              {/* AI List */}
              {userTab === "Ai" ? (
                <div className="px-6">
                  <div className="flex justify-between items-center px-4 py-2 ">
                    <span className='text-xl font-medium text-indigo-800'>
                      <i className="bi bi-file-earmark-check-fill"></i>AI ได้รับสิทธิ์ : {userData?.aiCount || 0}
                    </span>
                    <AddAIDialog />
                  </div>
                  <input
                    type="text"
                    id="first_name"
                    className="w-6/12 h-fit my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    placeholder="ค้นหาAI"
                  />
                  <AiApprovedListTable userId={userId} />
                </div>
              ) : userTab === "Workspace" ? (
                <>

                  {/* My wokspace Card group */}

                  <div className={` grid grid-cols-3 pb-8 pt-2 `}>
                    {Array.isArray(myWorkspace) && myWorkspace.map((data, index) => (
                      <div key={index} className={`mb-4 `}>
                        <Link to={`/workspaces/${data.id}/project-list`}>
                          <WorkspaceCard
                            id={data.id}
                            name={data.name}
                            desc={data.description}
                            members={data.members}
                            updatedAt={data.updatedAt}
                            createAt={data.createdAt}
                          />
                        </Link>
                      </div>
                    ))}
                  </div>

                </>


              ) : null}
            </div>
          </div>

          {/* card container */}
        </div>
      </div>
      <MiniFooter></MiniFooter>
    </>
  );
}

export default UserDetailPage