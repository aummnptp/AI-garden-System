import MiniFooter from "../../components/MiniFooter";

import AIDisPlayResultComponent from "../../components/aiDisplay/AIDisPlayResultComponent";
import Sidebar from "../../components/Sidebar";
import { useParams } from "react-router-dom";
import AddNoteDialog from "../../components/NoteDialog";
import { useProjecteData } from "../../hook/projects/useProjectData";
import { useWorkspaceData } from "../../hook/workspaces/useWorksapceData";
import { useHistoryData } from "../../hook/history/useHistoryData";
import SkeletonLayout from "../../components/SkeletonPageLayout";
import { Note } from "../../types/History";
import { getImageUrl } from "../../function/util";

const HistoryDetailPage = () => {
  const {  projectId, historyId } = useParams<{
    workspaceId: string;
    projectId: string;
    historyId: string;
  }>();

  const { 
    historyDetail, 
    isLoadingHistoryDetail,
    historyNoteData,
    isLoadingHistoryNoteData,
    refetchHistoryNoteData,
  
  } =
  useHistoryData();

  const { workspaceDetail, isLoadingWorkspace,  } =
    useWorkspaceData();
  const { projectDetail, isLoadingProjectDetail,  } =
    useProjecteData();

  if (isLoadingWorkspace||isLoadingProjectDetail||isLoadingHistoryDetail||isLoadingHistoryNoteData) return <SkeletonLayout />;

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <Sidebar workspace={workspaceDetail} project={projectDetail} />

        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] shadow-lg">
            <div className="flex justify-between items-center p-5 border-b border-zinc-300">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900">
                {/* {projectDetail.inputType === 'รูปภาพ' ? 'Upload Image' : 'Upload Video'} */}
              </h1>
            </div>

            <div className="p-5">
              <AIDisPlayResultComponent
                resultImage={getImageUrl(historyDetail.filePath)}
                predictResult={historyDetail}
              />
            </div>

            <div className="flex flex-col p-5">
              <div className="flex justify-end">
                <AddNoteDialog
                  projectId={projectId ?? ""}
                  historyId={historyId ?? ""}
                  onNoteAdded={refetchHistoryNoteData}
                />
              </div>
              <div className="mt-5">
                <h2 className="text-2xl font-medium text-indigo-900">
                  บันทึกทั้งหมด
                </h2>
                {historyNoteData && historyNoteData.length > 0 ? (
                  historyNoteData.map((note:Note) => (
                    <div
                      key={note.note_id}
                      className="border rounded p-3 my-2 bg-gray-50"
                    >
                      <h3 className="font-semibold text-indigo-800">
                        {note.title}
                      </h3>
                      <p className="text-gray-700">{note.content}</p>
                      <small className="text-gray-500">
                        เพิ่มเมื่อ: {new Date(note.created_at).toLocaleString()}
                      </small>
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
