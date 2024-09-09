import React from "react";
import Sidebar from "../../components/Sidebar";
import ProjectImage from "../../components/card/ProjectLetterImage";


import {  ExclamationCircleOutlined, InfoCircleOutlined, PictureOutlined, ScheduleOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import MiniFooter from "../../components/MiniFooter";
import Barchart from "../../components/chart/BarChart";

import DoughnutChart from "../../components/chart/doughnutChart";
import SummaryCard from "../../components/chart/sumaryCard";
import UsageBarChart from "../../components/chart/UsageBarChart";
import SubmitRankTable from "../../components/table/SubmitRankTable";
import { Link, useParams } from "react-router-dom";
import ProjectData from "../../data/ProjectData";
import { IconButton, ImageList, ImageListItem, ImageListItemBar, ListSubheader } from "@mui/material";



interface ProjectCardProps {
    name:string;
    aiDesc:string;
    inputDesc:string;
    type:string
    tags:string;
    img:string;
}


const ProjectDetail:React.FC<ProjectCardProps> = () => {

  const { workspaceId, projectId } = useParams<{ workspaceId?: string, projectId?: string }>();

  if (typeof workspaceId === 'undefined' || typeof projectId === 'undefined') {
    // จัดการกรณีที่ workspaceId หรือ projectId เป็น undefined
    return <div>ไม่มี ID ของพื้นที่ทำงานหรือ ID ของโครงการ</div>;
  }

  const workspaceIdNum = parseInt(workspaceId, 10);
  const projectIdNum = parseInt(projectId, 10);

  const workspace = ProjectData.find(ws => ws.workspaceId === workspaceIdNum);
  
  if (!workspace) {
    return <div>ไม่พบพื้นที่ทำงาน</div>;
  }

  const detail = workspace.details.find(d => d.id === projectIdNum);

  if (!detail) {
    return <div>ไม่พบรายละเอียดโปรเจก</div>;
  }


  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar></Sidebar>
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          {/* top card (create sort workspace name) */}
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
            <h1
              className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight 
            text-indigo-900 "
            >
              รายละเอียด
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
          </div>

          {/* detail */}
          <div className="mt-10 p-4 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
            <div className="grid grid-cols-6">
            {detail.projectImage ? (
             <img
               className=" col-span-2 w-full h-[100%] object-cover"
             src={detail.projectImage}
             alt={`${detail.name} project`}
             />
            ) : (
              
              <ProjectImage
              projectName={detail.name}
              className="m-2  w-full   col-span-2  h-[100%] rounded-[10px] mx-2 border-2 flex items-center justify-center text-white font-medium text-5xl"
              />
            )}
            
              <div className="col-span-4 p-6">
                <div>
                  <div className="flex items-center">
                    <h1
                      className=" mb-2 text-3xl font-medium tracking-tight 
                  text-indigo-900 "
                    >
                      {detail.name}
                    </h1>

                    <span className=" ml-3 w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                      Object Detection
                    </span>
                  </div>
                  <div className=" w-full border border-zinc-300" />
                </div>
                {/* ai creater */}
                <div className="flex items-center my-4">
                  <img
                    className="w-10 h-10 rounded-full border-2 bg-red-200 "
                    src="/images/homeImage/puttipong.jpg"
                  />
                  <div className="ml-2">
                    <p className="text-black text-lg font-normal">
                      putthipong Chobngam
                    </p>
                    <p className="text-indigo-900 text-base font-medium">
                      ผู้สร้าง
                    </p>
                  </div>
                </div>
                <p className=" text-neutral-700 text-lg font-normal">
                  รายละเอียด
                </p>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's{" "}
                </p>
                <div className="mb-2 mt-4">
                  <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                    tag1
                  </span>
                  <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                    tag2
                  </span>
                  <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                    tag3
                  </span>
                </div>
              </div>
            </div>

            {/*  */}
            <div className=" mt-6 ml-3 ">
              <ExclamationCircleOutlined style={{ color: "#404040" }} />
              <span className="text-neutral-700 text-lg font-normal">
                เกี่ยวกับรูปภาพและวิดีโอที่จะนำไปประมวลผล
              </span>
            </div>
            <p className="ml-3">
              รูปภาพที่นำมาอัพโหลด ให้ประมวลผลต้องเป็นรูปภาพเกี่ยวกับสัตว์เลี้ยง
              ได้แก่สุนัข แมว นก กระต่าย เต่า เท่านั้น{" "}
            </p>

            {/* เริ่มต้นใช้งาน */}
            <div className="flex flex-col my-10">
  <div className="flex items-center">
    <div className="mx-1 w-12 h-12 bg-indigo-900 rounded-[5px] flex items-center justify-center">
      <UploadOutlined style={{ color: "#fff", fontSize: "2em" }} />
    </div>
    <div className="ml-3 flex-1">
      <h1 className="text-indigo-900 text-2xl font-medium">
        เริ่มต้นใช้งาน
      </h1>
      <div className="mt-2 w-full border border-zinc-300" />
    </div>
  </div>
      <Link to={`/workspaces/${workspaceId}/project-list/${projectId}/detail/test/${projectId}`} className="ml-16 mt-2">
        <button
          type="button"
          className="text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
        >
          อัพโหลดรูปภาพ
        </button>
      </Link>
    </div>

            
          </div>

          <div className="mt-10 p-4 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
            {/* bottom content (dashboard chart graph) */}
            <div className="flex items-center my-10">
              <div className="mx-1 w-12 h-12 bg-indigo-900 rounded-[5px] flex items-center justify-center ">
                <ScheduleOutlined style={{ color: "#fff", fontSize: "2em" }} />
              </div>
              <div className="ml-3 w-full bg-r">
                <h1 className="text-indigo-900 text-2xl font-medium mb-[-10px]">
                  Project Summary
                </h1>
                <div className="mt-6 w-full border border-zinc-300" />
              </div>
            </div>

            <div className="">

             

         

              {/* Sumary Content Row1 */}
              <div className="grid grid-cols-3 px-10">
                <SummaryCard
                  icon={
                    <UserOutlined style={{ color: "#fff", fontSize: "2em" }} />
                  }
                  label="จำนวนผู้ใช้ทั้งหมด"
                  value="512"
                  valueType="ผู้ใช้"
                  disable={false}
                />
                {/* รูป summary */}
                {detail.inputType === "รูปภาพ"  ? (
               
                <SummaryCard
                  icon={
                    <PictureOutlined
                      style={{ color: "#fff", fontSize: "2em" }}
                    />
                  }
                  label="ประมวลผลด้วยภาพ"
                  value="5.32k"
                  valueType="ภาพ"
                  disable={false}
                />
              ) : (
                <SummaryCard
                  icon={
                    <VideoCameraOutlined
                      style={{ color: "#fff", fontSize: "2em" }}
                    />
                  }
                  label="ประมวลผลด้วยภาพ"
                  value=""
                 valueType="ภาพ"
                  disable={true}
                />
              )}
                {/* วิดีโอ summary */}
                {detail.inputType === "วิดีโอ"  ? (
                <SummaryCard
                icon={
                  <PictureOutlined
                    style={{ color: "#fff", fontSize: "2em" }}
                  />
                }
                label="ประมวลผลด้วยวิดีโอ"
                value="5.32k"
               valueType="วิดีโอ"
                disable={false}
              />
                ):(
              <SummaryCard
                icon={
                  <VideoCameraOutlined
                    style={{ color: "#fff", fontSize: "2em" }}
                  />
                }
                label="ประมวลผลด้วยวิดีโอ"
                value=""
                valueType="วิดีโอ"
                disable={true}
              />
              )}
              </div>

       {/* usage  */}
       <div className="flex  my-10 ">
                  <div className=" w-full   mx-auto flex">
                    {/* <UsageBarChart /> */}
                    <SubmitRankTable></SubmitRankTable>

                 


                  </div>
                </div>

              {/* Sumary Content Row/ */}
              <div className="grid grid-cols-2 px-10 my-4">
                {/* create date card */}
                <div className="flex h-full items-center  bg-white shadow rounded-md m-2">
                <div className="w-2 h-full bg-indigo-600 rounded-tl-[15px] rounded-bl-[15px]" />
                {/* <div className="w-12 h-12 ml-2 bg-indigo-900 rounded flex items-center justify-center"> */}
                  {/* icon */}
                {/* </div> */}
                  <div className="ml-4">
                    <div className="py-4">
                    <p className="text-gray-600">วันที่สร้าง</p>
                    <span className="text-indigo-900 text-2xl font-bold">
                      2 มิถุนายน 2567
                    </span>
                    </div>
                  </div>
                </div>
                  {/* update date card */}
                  <div className="h-full flex items-center bg-white shadow rounded-md  m-2">
                  <div className="w-2 h-full bg-indigo-600 rounded-tl-[15px] rounded-bl-[15px]" />
                  <div className="ml-4">
                  <div className="py-4">
                    <p className="text-gray-600">วันที่อัปเดตล่าสุด</p>
                    <span className="text-indigo-900 text-2xl font-bold">
                      15 มิถุนายน 2567
                    </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex ">
                  <div className="w-[70%] mx-auto">
                    <Barchart />
                  </div>
                  <div className="w-[30%] mx-auto">
                    <DoughnutChart />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <MiniFooter></MiniFooter>
    </>
  );
};

export default ProjectDetail;
