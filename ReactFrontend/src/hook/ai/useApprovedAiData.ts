import { useQuery } from "@tanstack/react-query";
import { fetchApprovedAiService } from "../../api/services/AiService";

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

    return {
      MyApprovedAi,
      isLoadingAI,
      isErrorAI,
      refetchAIModels,
    };
};
