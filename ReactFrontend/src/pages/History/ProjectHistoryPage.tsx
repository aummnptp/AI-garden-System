import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import MiniFooter from "../../components/MiniFooter";
import Sidebar from "../../components/Sidebar";
import { NoteAltOutlined, UploadFile } from "@mui/icons-material";
import HistoryUploadSection from "../../components/HistoryUploadSection";
import NoteSection from "../../components/NoteSection";
import { useProjecteData } from "../../hook/projects/useProjectData";
import { useWorkspaceData } from "../../hook/workspaces/useWorksapceData";
import { useHistoryData } from "../../hook/history/useHistoryData";
import { useFetchQuery } from "../../hook/useFetchQuery";

const ProjectHistoryPage = () => {
  const [historyTab, setHistoryTab] = useState<string>("Upload");
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const {
    projectHistory,
    isLoadingHistory,
    isErrorHistory,
    projectNotes,
    isLoadingNotes,
    isErrorNotes,
  } = useHistoryData();

  // const { workspaceDetail, isLoadingWorkspace, isErrorWorkspace } =
  //   useWorkspaceData();
  // const { projectDetail, isLoadingProjectDetail, isErrorProjectDetail } =
  //   useProjecteData();
  const {
      data: workspaceDetail = {},
      isLoading: isLoadingWorkspaceDetail,
      error: errorWorkspaceDetail,
    } = useFetchQuery(
      ["workspace-detail", workspaceId ?? ""],
      `/workspaces/detail/${workspaceId}`
    );
  // ดึงข้อมูล history
  const {
    data: historyData,
    isLoading,
    error,
  } = useFetchQuery(
    ["project-history", workspaceId ?? "", projectId ?? ""],
    `/workspaces/${workspaceId}/projects/all-history/${projectId}`
  );

  // ดึง input_type ของ project
  const {
    data: projectDetail,
    isLoading: isLoadingProjectDetail,
    error: errorProjectDetail,
  } = useFetchQuery(
    ["project-detail", workspaceId ?? "", projectId ?? ""],
    `/workspaces/${workspaceId}/projects/detail/${projectId}`
  );

  // Loading และ Error State
  if (isLoading || isLoadingProjectDetail || isLoadingWorkspaceDetail) return <div>Loading...</div>;
  if (error || errorProjectDetail || errorWorkspaceDetail)
    return (
      <div>
        Error: {error?.message || errorProjectDetail?.message || errorWorkspaceDetail?.message}
      </div>
    );

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar workspace={workspaceDetail} project={projectDetail}></Sidebar>
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
            <h1 className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight text-indigo-900 ">
              Project History
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />

            <div className="mt-6 flex justify-start px-6 ">
              <a
                onClick={() => setHistoryTab("Upload")}
                className={`w-[50%] border-b-2 inline-block rounded-t-lg cursor-pointer px-4 py-2 text-center font-medium  
                  ${historyTab === "Upload"
                    ? "text-indigo-600 border-indigo-600"
                    : "border-transparent text-gray-600 hover:border-gray-300"
                  }`}
              >
                <UploadFile /> ประวัติอัปโหลด (
                {projectDetail?.input_type === "วิดีโอ" ? "วิดีโอ" : "ภาพ"})
              </a>

              <a
                onClick={() => setHistoryTab("Note")}
                className={`w-[50%]  border-b-2 inline-block rounded-t-lg cursor-pointer px-4 py-2 text-center font-medium 
                  ${historyTab === "Note"
                    ? "text-indigo-600 border-indigo-600"
                    : "border-transparent text-gray-600 hover:border-gray-300"
                  }`}
              >
                <NoteAltOutlined /> ประวัติ Note
              </a>
            </div>
          </div>

          <div className="py-10 mt-4 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative pt-10 px-10 ">
            {historyTab === "Upload" ? (
              <HistoryUploadSection
                historyData={projectHistory} // ใส่ข้อมูลที่ดึงมาจาก API
                workspaceId={workspaceId ?? ""}
                projectId={projectId ?? ""}
                inputType={projectDetail?.input_type} // ส่ง inputType ไปด้วย
              />
            ) : // <div></div>
            historyTab === "Note" ? (
              <NoteSection projectNoteData={projectNotes} />
            ) : null}
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default ProjectHistoryPage;
