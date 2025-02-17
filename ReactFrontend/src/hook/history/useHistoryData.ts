import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchHistoryNoteDataService, fetchProjectHistoryDetailService, fetchProjectHistoryService, fetchProjectNotesService } from "../../api/services/HistoryService";


export const useHistoryData = () => {
  const { workspaceId, projectId,historyId } = useParams<{ workspaceId: string; projectId: string; historyId:string}>();

  const {
    data: projectHistory = [],  
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["project-history", workspaceId, projectId],
    queryFn: () => fetchProjectHistoryService(workspaceId!, projectId!),
    enabled: !!workspaceId && !!projectId,
  });


  const {
    data: projectNotes = [], 
    isLoading: isLoadingNotes,
    isError: isErrorNotes,
  } = useQuery({
    queryKey: ["project-notes", projectId],
    queryFn: () => fetchProjectNotesService(projectId!),
    enabled: !!projectId,
  });

  const {
    data: historyDetail, 
    isLoading: isLoadingHistoryDetail,
    isError: isErrorHistoryDetail,
  } = useQuery({
    queryKey: ["project-history-detail", workspaceId ,
      projectId ,
      historyId ],
    queryFn: () => fetchProjectHistoryDetailService(workspaceId!,projectId!,historyId!),
    enabled: !!projectId && !!historyId,
  });

  const {
    data: historyNoteData,
    isLoading: isLoadingHistoryNoteData,
    isError: isErrorHistoryNoteData,
    refetch: refetchHistoryNoteData,
  } = useQuery({
    queryKey: ["history-notes", projectId, historyId],
    queryFn: () => fetchHistoryNoteDataService(projectId!, historyId!),
    enabled: !!projectId && !!historyId, 
  });


  return {
 
    projectHistory,
    isLoadingHistory,
    isErrorHistory,
    refetchHistory,

    projectNotes,
    isLoadingNotes,
    isErrorNotes,

    historyDetail, 
    isLoadingHistoryDetail,
    isErrorHistoryDetail,


    historyNoteData,
    isLoadingHistoryNoteData,
    isErrorHistoryNoteData,
    refetchHistoryNoteData,
  };
};
