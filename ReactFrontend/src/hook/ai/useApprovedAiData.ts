import { useQuery } from "@tanstack/react-query";
import { fetchAiLimitSettingService, fetchAllAiTag, fetchApprovedAiService } from "../../api/services/AiService";

export const useApprovedAiData = () => {

  const {
    data: MyApprovedAi = [],
    isLoading: isLoadingAI,
    isError: isErrorAI,
    refetch: refetchAIModels,
  } = useQuery({
    queryKey: ["my-ai-approved"],
    queryFn: async () => {
      const response = await fetchApprovedAiService();

      return Array.isArray(response) ? response : []; 
    },
    placeholderData: [],
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
  
  
    const {
      data: aiTags,
      isLoading: isLoadingaiTags,
      isError: isErroaiTags,
    } = useQuery({
      queryKey: ["ai-tags"],
      queryFn: () => fetchAllAiTag(),
    });
  
    
  
    return {
      MyApprovedAi,
      isLoadingAI,
      isErrorAI,
      refetchAIModels,
  
      aiSettingData,
      isLoadingAiSetting,
      isErrorAiSetting,
      refetchAiSetting,
  
      aiTags, isLoadingaiTags, isErroaiTags,
  
    };
};
