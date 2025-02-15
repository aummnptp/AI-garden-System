
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchAiLimitSettingService, fetchAiModelsService } from "../../api/services/AiService";


export const useAiData = () => {
  // const { workspaceId, projectId,historyId } = useParams<{ workspaceId: string; projectId: string; historyId:string}>();
  const {
    data: AIData,
    isLoading: isLoadingAI,
    isError: isErrorAI,
    refetch: refetchAIModels,
  } = useQuery({
    queryKey: ["ai-models"],
    queryFn: () => fetchAiModelsService(), // เรียก API ดึงข้อมูล
  });


  const {
    data: aiSettingData,
    isLoading: isLoadingAiSetting,
    isError: isErrorAiSetting,
    refetch: refetchAiSetting,
  } = useQuery({
    queryKey: ["ai-usage-limit-setting"],
    queryFn: () => fetchAiLimitSettingService(),
  });




  return {
    AIData,
    isLoadingAI,
    isErrorAI,
    refetchAIModels,

    aiSettingData,
    isLoadingAiSetting,
    isErrorAiSetting,
    refetchAiSetting,

  };
};
