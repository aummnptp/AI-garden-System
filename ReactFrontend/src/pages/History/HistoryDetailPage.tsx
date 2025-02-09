import React, { useEffect, useState } from "react";
import MiniFooter from "../../components/MiniFooter";
import { Button } from "@mui/material";
import AIDisPlayResultComponent from "../../components/aiDisplay/AIDisPlayResultComponent";
import Sidebar from "../../components/Sidebar";
import { useFetchQuery } from "../../hook/useFetchQuery";
import { useParams } from "react-router-dom";


const HistoryDetailPage = () => {
  const { workspaceId, projectId, historyId } = useParams<{
    workspaceId: string;
    projectId: string;
    historyId: string;
  }>();
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error: errorHistory,
  } = useFetchQuery(
    ["project-history", workspaceId ?? "", projectId ?? "", historyId ?? ""],
    `/workspaces/${workspaceId}/projects/history/${historyId}`
  );

  // ดึงข้อมูล workspace detail
  // const {
  //   data: workspaceDetail,
  //   isLoading: isLoadingWorkspace,
  //   error: errorWorkspace,
  // } = useFetchQuery(
  //   ["workspace-detail", workspaceId ?? ""],
  //   `/workspaces/${workspaceId}/workspaces/detail/${workspaceId}`
  // );

  // ตรวจสอบสถานะการโหลด
  if (isLoadingHistory ) return <div>Loading...</div>;

  // ตรวจสอบข้อผิดพลาด
  if (errorHistory )
    return <div>Error: {errorHistory?.message }</div>;

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <Sidebar
          // workspaceName={workspaceDetail.name}
          // projectName={projectDetail.project_name}
          // aiName={projectDetail.ai_model.name}
          // aiType={projectDetail.ai_model.ai_type}
        />

        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                {/* {projectDetail.inputType === 'รูปภาพ' ? 'Upload Image' : 'Upload Video'} */}
              </h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>

            {/* upload step */}
            <>
              <AIDisPlayResultComponent
                resultImage={historyData.filePath}
                predictResult={historyData}
              />
            </>
            <div className="flex justify-end">
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#3b82f6",
                  "&:hover": {
                    backgroundColor: "#2563eb", // สีที่ต้องการเมื่อ hover
                  },
                }}
                // onClick={handleToCustomStep}
              >
                {" "}
                ถัดไป
              </Button>
            </div>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default HistoryDetailPage;
