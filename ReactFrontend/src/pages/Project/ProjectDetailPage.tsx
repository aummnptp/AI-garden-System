import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ProjectImage from "../../components/card/ProjectLetterImage";

import {
  ExclamationCircleOutlined,
  PictureOutlined,
  ScheduleOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import MiniFooter from "../../components/MiniFooter";
import Barchart from "../../components/chart/BarChart";
import SummaryCard from "../../components/chart/sumaryCard";
import SubmitRankTable from "../../components/table/SubmitRankTable";
import { Link, useParams } from "react-router-dom";
import { Alert, Button, Snackbar } from "@mui/material";

import { formatDate } from "../../function/util";
import { useWorkspaceData } from "../../hook/workspaces/useWorksapceData";
import { useProjecteData } from "../../hook/projects/useProjectData";

import { useFetchQuery } from "../../hook/useFetchQuery";
import SkeletonLayout from "../../components/SkeletonPageLayout";

const ProjectDetailPage = () => {
  const { workspaceId, projectId } = useParams<{
    workspaceId?: string;
    projectId?: string;
  }>();
  const [openAlert] = useState(false);

  const { workspaceDetail, isLoadingWorkspace } = useWorkspaceData();
  const { projectDetail, isLoadingProjectDetail } = useProjecteData();

  const {
    data: mediaCount = { imageCount: 0, videoCount: 0 },
    isLoading: isLoadingMediaCount,
  } = useFetchQuery(
    ["media-count", workspaceId ?? "", projectId ?? ""],
    `/workspaces/${workspaceId}/projects/count-media/${projectId}`
  );
  // ตรวจสอบข้อผิดพลาด

  if (isLoadingProjectDetail || isLoadingWorkspace || isLoadingMediaCount)
    return <SkeletonLayout />;
  const uploadIcon =
    projectDetail.input_type === "รูปภาพ" ? (
      <PictureOutlined />
    ) : (
      <VideoCameraOutlined />
    );
  return (
    <>
      <Snackbar open={openAlert} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          this project not allowed
        </Alert>
      </Snackbar>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar workspace={workspaceDetail} project={projectDetail} />

        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          {/* top card (create sort workspace name) */}
          <div className="mt-4 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
            <h1
              className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight 
            text-indigo-900 "
            >
              รายละเอียด
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
          </div>

          {/* detail */}
          <div className="mt-4 p-4 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
            <div className="grid grid-cols-6">
              {projectDetail.imagePath ? (
                <img
                  className=" col-span-2 w-full h-[100%] object-cover"
                  src={projectDetail.imagePath}
                />
              ) : (
                <ProjectImage
                  projectName={projectDetail.name}
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
                      {projectDetail.name}
                    </h1>

                    <span className=" ml-3 w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                      {projectDetail.ai_model.ai_type}
                    </span>
                  </div>
                  <div className=" w-full border border-zinc-300" />
                </div>
                {/* ai creater */}
                <div className="flex items-center my-4">
                  <img
                    className="w-10 h-10 rounded-full border-2 bg-red-200 "
                    src={projectDetail.createdBy.picture || null}
                  />
                  <div className="ml-2">
                    <p className="text-black text-lg font-normal">
                      {projectDetail.createdBy.name}
                    </p>
                    <p className="text-indigo-900 text-base font-medium">
                      ผู้สร้างโปรเจกต์
                    </p>
                  </div>
                </div>
                <p className=" text-neutral-700 text-lg font-normal">
                  รายละเอียด
                </p>
                <p>{projectDetail.description}</p>
                <div className="mb-2 mt-4">
                  {projectDetail.ai_model.ai_tag.map((tag: string) => (
                    <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                      {tag}
                    </span>
                  ))}
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
              {projectDetail.ai_model.input_desc}
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
              <Link
                to={
                  projectDetail.ai_model.enable
                    ? `/workspaces/${workspaceId}/project/${projectId}/predict`
                    : "#"
                }
                className={`ml-16 mt-2 ${
                  !projectDetail.ai_model.enable
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={uploadIcon}
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#3730a3",
                    },
                  }}
                  disabled={!projectDetail.ai_model.enable} // ปิดปุ่มถ้า AI Model ไม่ Enable
                >
                  {projectDetail.input_type === "รูปภาพ"
                    ? "อัพโหลดรูปภาพ"
                    : "อัพโหลดวิดีโอ"}
                </Button>
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
                {projectDetail.input_type === "รูปภาพ" ? (
                  <SummaryCard
                    icon={
                      <PictureOutlined
                        style={{ color: "#fff", fontSize: "2em" }}
                      />
                    }
                    label="ประมวลผลด้วยภาพ"
                    value={mediaCount.imageCount.toLocaleString()} // แสดงจำนวนรูปภาพ
                    valueType="ภาพ"
                    disable={mediaCount.imageCount === 0}
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
                {projectDetail.input_type === "วิดีโอ" ? (
                  <SummaryCard
                    icon={
                      <VideoCameraOutlined
                        style={{ color: "#fff", fontSize: "2em" }}
                      />
                    }
                    label="ประมวลผลด้วยวิดีโอ"
                    value={mediaCount.videoCount.toLocaleString()} // แสดงจำนวนวิดีโอ
                    valueType="วิดีโอ"
                    disable={mediaCount.videoCount === 0}
                  />
                ) : (
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
                        {formatDate(projectDetail.created_at)}
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
                        {formatDate(projectDetail.updated_at)}
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
                  {/* <div className="w-[30%] mx-auto">
                    <DoughnutChart />
                  </div> */}
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

export default ProjectDetailPage;
