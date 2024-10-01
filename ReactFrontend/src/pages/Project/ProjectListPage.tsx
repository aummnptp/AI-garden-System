import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProjectCard from "../../components/card/ProjectCard";
import ProjectData from "../../data/ProjectData";
import MiniFooter from "../../components/MiniFooter";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

const ProjectListPage = () => {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const [workspaceDetail, setWorkspaceDetail] = useState([]); 
  if (typeof workspaceId === 'undefined') {
    // Handle the case where workspaceId is undefined
    return <div>No workspace ID provided</div>;

  }
  const id = parseInt(workspaceId, 10);
  const workspace = ProjectData.find(ws => ws.workspaceId === id);

  const fetchData = () => {
    axios.all([
      axios.get(`http://localhost:3000/workspaces/${workspaceId}`),
  
    ])
    .then(axios.spread((workspaceResponse) => {
      setWorkspaceDetail(workspaceResponse.data);
   
    }))
    .catch(error => {
      console.error("There was an error fetching the data!", error);
    });
  };

  useEffect(() => {
    fetchData(); // ดึงข้อมูล workspace เมื่อ component โหลดครั้งแรก
  }, []);

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
        {workspace?.details.map(data => (
              <Link key={data.id} to={`/workspaces/${workspaceId}/project/${data.id}/detail`}>
                <ProjectCard
                  name={data.name}
                  desc={data.desc}
                  projectImage={data.projectImage}
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
