
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchAiLimitSettingService, fetchAiModelsService, fetchAllAiTag } from "../../api/services/AiService";
import { useDebounce } from "../useDebounce";


export const  useAiData = () => {
  // const { workspaceId, projectId,historyId } = useParams<{ workspaceId: string; projectId: string; historyId:string}>();
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
