import { TextField } from "@mui/material";
import React from "react";
import { Link, useParams } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ProjectData from "../data/ProjectData";
import MiniFooter from "../components/MiniFooter";
import Sidebar from "../components/Sidebar";

const ProjectList = () => {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  if (typeof workspaceId === 'undefined') {
    // Handle the case where workspaceId is undefined
    return <div>No workspace ID provided</div>;
  }
  const id = parseInt(workspaceId, 10);
  const workspace = ProjectData.find(ws => ws.workspaceId === id);
  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
           {/* side bar */}
        <Sidebar></Sidebar>
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <h1 className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight text-indigo-900 ">
              Workspace Name {workspaceId}
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <div className="m-6 flex justify-between">
              <div>
                <button
                  type="button"
                  className="text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none "
                >
                  ชื่อsort
                </button>
                <button
                  type="button"
                  className="text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none "
                >
                  ประเภท filter
                </button>
              </div>
              <Link to={`/workspaces/${workspaceId}/create`}>
                <button
                  type="button"
                  className="text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none "
                >
                  + Create New Project
                </button>
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
              <button
                type="button"
                className="text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none "
              >
                + Add Tag filter
              </button>
            </div>
          </div>
          <div className="py-10  mt-16 h-fit w-11/12 grid grid-cols-2 bg-white rounded-[15px] justify-self-center relative ">
        {workspace?.details.map(data => (
              <Link key={data.id} to={`/workspaces/${workspaceId}/project-list/${data.id}/detail`}>
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

export default ProjectList;
