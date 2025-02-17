import { useQuery } from "@tanstack/react-query";
import { fetchAiLimitSettingService, fetchAllAiTag, fetchApprovedAiService } from "../../api/services/AiService";

export const useApprovedAiData = () => {
  console.log("🔍 useApprovedAiData ถูกเรียก!"); // ✅ ตรวจสอบว่า Hook ถูกเรียกจริงไหม

  const {
    data: AIData = [],
    isLoading: isLoadingAI,
    isError: isErrorAI,
    refetch: refetchAIModels,
  } = useQuery({
    queryKey: ["ai-approved-models"],
    queryFn: async () => {
      console.log("📡 เรียก API fetchApprovedAiService...");
      const response = await fetchApprovedAiService();
      console.log("✅ API Response:", response); // ✅ ตรวจสอบว่า API ส่งค่ากลับมาไหม

      return Array.isArray(response) ? response : []; // ✅ ป้องกัน `undefined`
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
      AIData,
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
