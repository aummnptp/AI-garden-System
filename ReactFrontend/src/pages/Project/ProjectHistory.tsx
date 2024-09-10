import { TextField } from "@mui/material";
import React from "react";
import { Link, useParams } from "react-router-dom";
import ProjectCard from "../../components/card/ProjectCard";
import ProjectData from "../../data/ProjectData";
import MiniFooter from "../../components/MiniFooter";
import Sidebar from "../../components/Sidebar";
import ImageUploader from "../../components/ImageUploader";

const ProjectHistory = () => {
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
            <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
              <h1 className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight text-indigo-900 ">
                Project History
              </h1>
              <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
            </div>

            <div className="py-10  mt-4 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative pt-10 px-10 ">
              <h1 className=" text-2xl font-normal  ">วันที่ 1 มกราคม</h1>
              <div className="flex  items-center space-x-2 px-2 rounded-[5px]">
                <text className=" text-lg font-normal  ">13.00 น.</text>
                <div className="w-[80%] h-[0px] border border-zinc-300 mx-auto" />
              </div>

              <div className="flex items-center my-4 w-fit">
                <img
                  className="w-10 h-10 rounded-full border-2"
                  src="/images/homeImage/profile.webp"
                />
                <div className="ml-2">
                  <text className="text-black text-lg font-normal">
                    ชื่อสกุล
                  </text>
                  <text className="text-black text-lg font-normal"> จำนวน</text>
                </div>
              </div>

              <div className="flex flex-wrap">
                <div  className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                    <p>abc</p>
                </div>
                <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>
                <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>
                <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>
                <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>
                <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>
                <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>
                <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>
                <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>
                <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>    <div className=" mb-8">
                  <img
                    className="w-28 h-28 mr-6  border-2"
                    src="/images/homeImage/profile.webp"
                    />
                     <p>ชื่อรูป</p>
                </div>
                
   
              </div>

            </div>
          </div>
        </div>
        <MiniFooter />
      </>
    );
}

export default ProjectHistory