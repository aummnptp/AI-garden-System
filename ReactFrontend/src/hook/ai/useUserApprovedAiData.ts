import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchAllAiTag, fetchUserApprovedAiService } from "../../api/services/AiService";

export const useUserApprovedAiData = () => {
  const { userId } = useParams<{ userId: string }>();

  const {
    data: AIData = [],
    isLoading: isLoadingAI,
    isError: isErrorAI,
    refetch: refetchAIModels,
  } = useQuery({
    queryKey: ["ai-approved-models", userId],
    queryFn: async () => {
      if (!userId) return []; // กรณีที่ userId ไม่มีค่า
      const response = await fetchUserApprovedAiService(userId);
      return Array.isArray(response) ? response : [];
    },
    placeholderData: [],
    enabled: Boolean(userId),
  });

  const {
    data: aiTags = [],
    isLoading: isLoadingaiTags,
    isError: isErroaiTags,
    refetch: refetchAiTags,
  } = useQuery({
    queryKey: ["ai-tags"],
    queryFn: fetchAllAiTag,
  });

  return {
    AIData,
    isLoadingAI,
    isErrorAI,
    refetchAIModels,
    aiTags,
    isLoadingaiTags,
    isErroaiTags,
    refetchAiTags,
  };
};
