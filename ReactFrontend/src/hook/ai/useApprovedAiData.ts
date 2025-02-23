import { useQuery } from "@tanstack/react-query";
import { fetchApprovedAiService } from "../../api/services/AiService";

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

    return {
      AIData,
      isLoadingAI,
      isErrorAI,
      refetchAIModels,
    };
};
