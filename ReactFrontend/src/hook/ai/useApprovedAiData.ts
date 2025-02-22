import { useQuery } from "@tanstack/react-query";
import { fetchAllAiTag, fetchApprovedAiService } from "../../api/services/AiService";

export const useApprovedAiData = () => {
  console.log("🔍 useApprovedAiData ถูกเรียก!"); 

  const {
    data: AIData = [],
    isLoading: isLoadingAI,
    isError: isErrorAI,
    refetch: refetchAIModels,
  } = useQuery({
    queryKey: ["ai-approved-models"],
    queryFn: async () => {
      const response = await fetchApprovedAiService();

      return Array.isArray(response) ? response : []; 
    },
    placeholderData: [],
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
      AIData,
      isLoadingAI,
      isErrorAI,
      refetchAIModels,
  
      aiTags, isLoadingaiTags, isErroaiTags,
  
    };
};
