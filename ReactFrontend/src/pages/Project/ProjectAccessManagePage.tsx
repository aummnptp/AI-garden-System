import React, { useEffect, useState } from "react";
import MiniFooter from "../../components/MiniFooter";
import Sidebar from "../../components/Sidebar";
import { Button, Checkbox, TextField } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ManageAccounts } from "@mui/icons-material";
import memberMockupData from "../../data/MemberData";

interface memberData {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

const ProjectAccessManagePage = () => {
  let { workspaceId, projectId } = useParams();
  const [name, setName] = useState<string>("");
  const [memberDatas, setMemberData] = useState<memberData[]>(memberMockupData);
  const [accessProjectType, setAccessProjectType] =useState<string>("access_all");
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [workspaceDetail, setWorkspaceDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
   
  const fetchData = async () => {
    try {
      const [workspaceResponse, projectResponse,memberResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/detail/${workspaceId}`),
        axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/detail/${projectId}`),
        axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/members-profiles/${workspaceId}`),
      ]);
  
      setWorkspaceDetail(workspaceResponse.data);
      setProjectDetail(projectResponse.data)
      setMemberData(memberResponse.data)
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    } finally {
      setLoading(false);
    }
  };
     useEffect(() => {
        fetchData(); // ดึงข้อมูล workspace และ project เมื่อ component โหลดครั้งแรก
      }, []);
  

if (loading) {
    return <div>Loading...</div>;
  }

  if (!projectDetail) {
    return <div>Error: Project details could not be loaded.</div>;
  }
  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar workspaceName={workspaceDetail.name} 
        projectName={projectDetail.project_name}
        aiName={projectDetail.ai_model.name}
        aiType={projectDetail.ai_model.ai_type}
         />

      {/* Content Container */}
      <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
        <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative px-5 pt-2">
          <h1 className="p-5 text-3xl font-medium tracking-tight text-indigo-900">
          <i className="bi bi-pencil-fill"></i>   Project Setting
          </h1>
          <div className="w-full h-[0px] border border-zinc-300 mx-auto" />

          {/* Menu Tabs */}
          <div className="flex justify-start">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <Link
                  to={`/workspaces/${workspaceId}/project/${projectId}/setting`}
                >
                  <a className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300">
                    Edit
                  </a>
                </Link>
              </li>
              <li className="me-2">
                <Link
                  to={`/workspaces/${workspaceId}/project/${projectId}/setting/access`}
                >
                  <a className="inline-block p-4  text-blue-600 border-b-2 border-blue-600 rounded-t-lg active">
                    Access Management
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Member Access Management */}
          <div className="w-[80%] mx-auto pt-8 pb-10">
            <div className=" w-full h-fit bg-white rounded-[15px] border border-zinc-300 mx-auto pt-4  my-5">
              <h1 className="text-black text-3xl px-10 pb-4">
                รูปแบบการอนุญาตสิทธิ์การใช้งานโปรเจกต์
              </h1>
              <div className="w-full h-[0px] border border-trueGray-300 mx-auto " />
              <div className="px-10 py-6 flex items-center  justify-between w-full ">
                <div className="flex items-center space-x-4 text-xl   mx-auto">
                  <label
                    className={`w-fit h-fit bg-white rounded-[15px] border px-4 py-2  ${
                      accessProjectType === "access_all"
                        ? "border-blue-600 border-2"
                        : "border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="access"
                      value="access_all"
                      className="w-4 h-4  "
                      checked={accessProjectType === "access_all"}
                      onChange={() => setAccessProjectType("access_all")}
                    />
                    <span> อนุญาตทุกคนใน workspace</span>
                  </label>
                  <label
                    className={`w-fit h-fit bg-white rounded-[15px] border px-4 py-2 ${
                      accessProjectType === "only_allowed"
                        ? "border-blue-600 border-2"
                        : "border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="access"
                      value="only_allowed"
                        className="w-4 h-4"
                      checked={accessProjectType === "only_allowed"}
                      onChange={() => setAccessProjectType("only_allowed")}
                    />
                    <span> เฉพาะ project owner และสมาชิกที่อนุญาต</span>
                  </label>
                </div>
              </div>
            </div>

            <div className=" w-full h-fit bg-white rounded-[15px] border border-zinc-300 mx-auto pt-4  my-5">
              <h1 className="text-black text-3xl px-10 pb-4">
                <ManageAccounts fontSize="large" />
                รายชื่อ Member
              </h1>

              <>
                <div className="w-full h-[0px] border border-trueGray-300 mx-auto " />
                {memberDatas
                  .sort((a, b) => {
                    if (a.role === "owner" && b.role === "member") return -1;
                    if (a.role === "member" && b.role === " owner") return 1;
                    return 0;
                  })
                  .map((member, index) => (
                    <div>
                      <div className="px-10 py-2 flex items-center  justify-between w-full">
                        <div className="flex items-center "  key={index}>
                          <img
                            className="w-10 h-10 rounded-full  border-2"
                            src={member.user.picture}

                            // src="/images/homeImage/profile.webp"
                          />
                          <div className="ml-2">
                            <p className="text-indigo-900 text-xl font-medium">
                              {member.user.name}
                            </p>
                            <p className="text-gray-400 text-lg ">
                              Email: {member.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center ">
                          {member.role == "owner" ? (
                            <span className="">Project Owner</span>
                          ) : (
                            <Checkbox
                              disabled={accessProjectType === "access_all"}
                            />
                          )}
                        </div>
                      </div>
                      <div className="w-full h-[0px] border border-trueGray-300 mx-auto " />
                    </div>
                  ))}
              </>
            </div>
          </div>
        </div>
      </div>
      <div className=" pl-[20%] justify-end pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex items-center">

        <Button
          size="large"
          variant="contained"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#3730a3" },
          }}
          style={{ marginRight: "0.5rem" }}
          // onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ProjectAccessManagePage;
