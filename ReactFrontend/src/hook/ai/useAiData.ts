
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchAiLimitSettingService, fetchAiModelsService, fetchAllAiTag } from "../../api/services/AiService";
import { useDebounce } from "../useDebounce";
import axios from "axios";


export const  useAiData = () => {
  const { ai_id } = useParams<{ ai_id:string}>();
  const [searchParams] = useSearchParams();


  const filters: Record<string, string> = {
    search: searchParams.get("search") || "", 
    type: searchParams.get("type") || "",
    tag: searchParams.get("tag") || "",
  };

  const debouncedFilters = {
    ...filters,
    search: useDebounce(filters.search, 500), 
  };
  const {
    data: AIData = [],
    isLoading: isLoadingAI,
    isError: isErrorAI,
    refetch: refetchAIModels,
  } = useQuery({
    queryKey: ["ai-models", debouncedFilters], 
    queryFn: () => fetchAiModelsService(filters),
     enabled: !ai_id,
  });



  const {
    data: aiModelData,
    isLoading: isLoadingAiModel,
    isError: isErrorAiModel,
    refetch: refetchAiModel,
  } = useQuery({
    queryKey: ["ai-model", ai_id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}`,
        { withCredentials: true }
      );
      return response.data;
    },
    enabled: !!ai_id, 
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

    aiModelData,
    isLoadingAiModel,
    isErrorAiModel,
    refetchAiModel,


    aiSettingData,
    isLoadingAiSetting,
    isErrorAiSetting,
    refetchAiSetting,

    aiTags, isLoadingaiTags, isErroaiTags,

  };
};
