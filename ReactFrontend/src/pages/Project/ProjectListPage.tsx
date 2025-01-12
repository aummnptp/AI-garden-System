import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProjectCard from "../../components/card/ProjectCard";
// import ProjectData from "../../data/ProjectData";
import MiniFooter from "../../components/MiniFooter";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import ProjectData from "../../data/ProjectData";

const ProjectListPage = () => {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const [workspaceDetail, setWorkspaceDetail] = useState([]); 
  const [projectData, setProjectData] = useState([]); 


  if (typeof workspaceId === 'undefined') {
    // Handle the case where workspaceId is undefined
    return <div>No workspace ID provided</div>;

  }


  // const fetchData =async () => {
  //   try{
  //     const [workspaceResponse, projectResponse] = await axios.all([
  //     axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/detail/${workspaceId}`),
  //     axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects`),
  //   ]);
  //     setWorkspaceDetail(workspaceResponse.data);
  //     setProjectData(projectResponse.data)
  //     console.log(projectResponse.data); // แสดงข้อมูล project ที่โหลดมา
  //   } catch (error) {
  //     console.error("There was an error fetching the data!", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData(); // ดึงข้อมูล workspace เมื่อ component โหลดครั้งแรก
  // }, []);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      // เรียก API หลายตัวพร้อมกัน
      const [
        workspaceResponse,projectResponse
         ] = await Promise.all([
              axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/detail/${workspaceId}`, {
                withCredentials: true,
              }),
              axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects`, {
                withCredentials: true,
              }),
             
            ]);  
      // อัปเดตสถานะของข้อมูลหลังจากที่ได้ผลลัพธ์
      setWorkspaceDetail(workspaceResponse.data);
      setProjectData(projectResponse.data)
    } catch (error) {
      console.error("Error fetching data!", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

console.log(projectData)
  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
           {/* side bar */}
           <Sidebar workspaceName={workspaceDetail.name} />
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
            <h1 className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight text-indigo-900 ">
              {workspaceDetail.name}
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"/>
            <div className="m-6 flex justify-between">
              <div>
              <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                },
              }}
       
              >
                  ชื่อsort
                </Button>
                <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                },
              }}
       
              >
                  ประเภท filter
                </Button>
              </div>
              <Link to={`/workspaces/${workspaceId}/create`}>
              <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                },
              }}
       
              >
                  + สร้าง Project
                </Button>
              </Link>
            </div>
            <div className="m-6 flex justify-start gap-4">
              <input
                type="text"
                id="first_name"
                className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  "
                placeholder="ค้นหาชื่อโปรเจค"
                required
              />
             <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                },
              }}
       
              >
                  + add tag filter
                </Button>
            </div>
          </div>
          <div className="py-10  mt-4 h-fit w-[95%] grid grid-cols-2 bg-white rounded-[15px] justify-self-center relative ">
        {projectData.map(data => (
              <Link key={data.project_id} to={`/workspaces/${workspaceId}/project/${data.project_id}/detail`}>
                <ProjectCard
                  name={data.project_name}
                  desc={data.project_desc}
                  projectImage={data.image_path}
                  ai_tags={data.ai_model.ai_tag}
                  ai_type={data.ai_model.ai_type}
                />
              </Link>
            ))}

          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default ProjectListPage;
