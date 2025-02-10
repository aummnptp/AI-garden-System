import React, { useEffect, useState } from "react";
import MiniFooter from "../../components/MiniFooter";
import { Button } from "@mui/material";
import AIDisPlayResultComponent from "../../components/aiDisplay/AIDisPlayResultComponent";
import Sidebar from "../../components/Sidebar";
import { useFetchQuery } from "../../hook/useFetchQuery";
import { useParams } from "react-router-dom";
import AddNoteDialog from "../../components/NoteDialog";


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

  const { data: noteData, refetch: refetchNotes } = useFetchQuery(
    ["history-notes",projectId??"", historyId ?? ""],
    `/projects/${projectId}/notes/${historyId}`
  );
  if ( isLoadingHistory) return <div>Loading...</div>;
  if (errorHistory)
    return <div>Error: {errorHistory?.message}</div>;

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
        <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] shadow-lg">
        <div className="flex justify-between items-center p-5 border-b border-zinc-300">
          <h1 className="text-3xl font-medium tracking-tight text-indigo-900">
          {/* {projectDetail.inputType === 'รูปภาพ' ? 'Upload Image' : 'Upload Video'} */}
          </h1>
        </div>

        <div className="p-5">
          <AIDisPlayResultComponent
          resultImage={historyData.filePath}
          predictResult={historyData}
          />
        </div>

          
        <div className="flex flex-col p-5">
              <div className="flex justify-end">
              <AddNoteDialog projectId={projectId ?? ""} historyId={historyId ?? ""} onNoteAdded={refetchNotes} />
              </div>
              <div className="mt-5">
                <h2 className="text-2xl font-medium text-indigo-900">บันทึกทั้งหมด</h2>
                {noteData && noteData.length > 0 ? (
                  noteData.map((note) => (
                    <div key={note.note_id} className="border rounded p-3 my-2 bg-gray-50">
                      <h3 className="font-semibold text-indigo-800">{note.title}</h3>
                      <p className="text-gray-700">{note.content}</p>
                      <small className="text-gray-500">เพิ่มเมื่อ: {new Date(note.created_at).toLocaleString()}</small>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">ยังไม่มีบันทึก</p>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>

      
    
      <MiniFooter />
    </>
  );
};

export default HistoryDetailPage;
